'use client';

import { useEffect, useMemo, useRef, useState, type KeyboardEvent } from 'react';
import { Ellipse, Group, Layer, Line, Rect, Stage, Text, Transformer } from 'react-konva';
import type Konva from 'konva';
import { useStore, type StoreApi } from 'zustand';
import { Grid2x2Plus, Maximize2, Minus, Plus, Save, SquareDashedMousePointer, Trash2 } from 'lucide-react';
import { DashboardNotice, ghostButton, primaryButton } from '@/components/workspace/DashboardKit';
import ColorField from '@/components/ui/ColorField';
import Select from '@/components/ui/Select';
import { SHAPE_PRESETS, readableText, visible, type DraftShape, type Rect as Box } from '@/lib/seatMap';
import type { SeatMapEditorState } from '@/stores/seatMapEditorStore';
import type { OrganizerTicket, SeatShapeType } from '@/types/dashboard';
import OrganizerField, { organizerInput } from './OrganizerField';

// Canvas tidak membaca CSS variable; nilai ini salinan token Tixo di globals.css.
const color = {
  ink: '#09090B', paper: '#FFF4EC', white: '#FFFFFF', line: '#E4E4E7', mute: '#A1A1AA',
  blaze: '#FF4D00', success: '#8DE2BD', grid: '#F4E6DA',
};
const GRID = 50;
const MIN_SCALE = 0.1;
const MAX_SCALE = 4;

type View = { scale: number; x: number; y: number };

export default function OrganizerSeatMapEditor({ store, tickets }: { store: StoreApi<SeatMapEditorState>; tickets: OrganizerTicket[] }) {
  const state = useStore(store);
  const { draft, selectedSection, selectedSeats, selectedShape } = state;
  const shapeNodes = useRef(new Map<string, Konva.Group>());
  const transformer = useRef<Konva.Transformer>(null);
  const container = useRef<HTMLDivElement>(null);
  const [size, setSize] = useState({ width: 800, height: 560 });
  // null = pas layar; dihitung saat render sehingga ikut ukuran wadah dan denah.
  const [manualView, setView] = useState<View | null>(null);
  const [block, setBlock] = useState({ rows: 4, cols: 10 });
  const selected = useMemo(() => new Set(selectedSeats), [selectedSeats]);
  const section = draft.sections.find((item) => item.key === selectedSection);
  const shape = draft.shapes.find((item) => item.key === selectedShape);
  const ticketColors = new Map(tickets.map((ticket) => [String(ticket.id), ticket.color]));
  const shapeOptions = (Object.keys(SHAPE_PRESETS) as SeatShapeType[]).map((type) => ({ value: type, label: SHAPE_PRESETS[type].name }));
  const ticketOptions = [{ value: '', label: 'Tanpa kelas tiket' }, ...tickets.map((ticket) => ({ value: String(ticket.id), label: ticket.name }))];

  const fitScale = Math.min(size.width / draft.width, size.height / draft.height) * 0.92;
  const view = manualView ?? { scale: fitScale, x: (size.width - draft.width * fitScale) / 2, y: (size.height - draft.height * fitScale) / 2 };
  const fit = () => setView(null);

  useEffect(() => {
    const node = container.current!;
    const observer = new ResizeObserver(([entry]) => {
      setSize({ width: entry.contentRect.width, height: window.innerWidth < 640 ? 420 : 560 });
    });
    observer.observe(node);
    return () => observer.disconnect();
  }, []);

  // Transformer (ubah ukuran dan putar) menempel pada elemen yang dipilih.
  useEffect(() => {
    const node = selectedShape ? shapeNodes.current.get(selectedShape) : undefined;
    transformer.current?.nodes(node ? [node] : []);
    transformer.current?.getLayer()?.batchDraw();
  }, [selectedShape, draft.shapes]);

  useEffect(() => {
    if (!state.dirty) return;
    const warn = (event: BeforeUnloadEvent) => event.preventDefault();
    window.addEventListener('beforeunload', warn);
    return () => window.removeEventListener('beforeunload', warn);
  }, [state.dirty]);

  // Viewport dalam koordinat denah untuk culling.
  const viewport: Box = { x: -view.x / view.scale, y: -view.y / view.scale, width: size.width / view.scale, height: size.height / view.scale };
  const shownSections = visible(draft.sections, viewport);
  // Elemen berputar: culling memakai kotak pembatas yang diperbesar agar sudutnya tidak terpotong.
  const shownShapes = draft.shapes.filter((item) => visible([{ ...item, x: item.x - item.width / 2, y: item.y - item.height / 2, width: item.width * 2, height: item.height * 2 }], viewport).length);
  const shownSeats = visible(draft.seats, viewport);
  const showSeatLabels = view.scale * 28 >= 20;

  const gridLines: number[][] = [];
  {
    const startX = Math.max(0, Math.floor(viewport.x / GRID) * GRID);
    const endX = Math.min(draft.width, viewport.x + viewport.width);
    const startY = Math.max(0, Math.floor(viewport.y / GRID) * GRID);
    const endY = Math.min(draft.height, viewport.y + viewport.height);
    for (let x = startX; x <= endX; x += GRID) gridLines.push([x, Math.max(0, viewport.y), x, endY]);
    for (let y = startY; y <= endY; y += GRID) gridLines.push([Math.max(0, viewport.x), y, endX, y]);
  }

  function zoomBy(factor: number, anchor = { x: size.width / 2, y: size.height / 2 }) {
    setView((previous) => {
      const current = previous ?? view;
      const scale = Math.min(MAX_SCALE, Math.max(MIN_SCALE, current.scale * factor));
      const mapX = (anchor.x - current.x) / current.scale;
      const mapY = (anchor.y - current.y) / current.scale;
      return { scale, x: anchor.x - mapX * scale, y: anchor.y - mapY * scale };
    });
  }

  function onWheel(event: Konva.KonvaEventObject<WheelEvent>) {
    event.evt.preventDefault();
    const pointer = event.target.getStage()!.getPointerPosition()!;
    zoomBy(event.evt.deltaY > 0 ? 1 / 1.12 : 1.12, pointer);
  }

  // Dipanggil saat drag berjalan dan selesai agar culling mengikuti posisi kanvas.
  function onStageDragEnd(event: Konva.KonvaEventObject<DragEvent>) {
    if (event.target === event.target.getStage()) setView({ scale: view.scale, x: event.target.x(), y: event.target.y() });
  }

  function clearOnEmpty(event: Konva.KonvaEventObject<MouseEvent | TouchEvent>) {
    if (event.target === event.target.getStage() || event.target.name() === 'canvas') {
      state.selectSection(null);
      state.selectShape(null);
    }
  }

  function onKeyDown(event: KeyboardEvent<HTMLDivElement>) {
    if ((event.target as HTMLElement).closest('input, textarea, button, [role="combobox"]')) return;
    if ((event.key === 'Delete' || event.key === 'Backspace') && selectedSeats.length) {
      event.preventDefault();
      state.deleteSelectedSeats();
    } else if ((event.key === 'Delete' || event.key === 'Backspace') && selectedShape) {
      event.preventDefault();
      state.deleteShape(selectedShape);
    } else if (event.key === 'Escape') {
      state.selectSection(null);
    }
  }

  const center = () => ({ x: viewport.x + viewport.width / 2 - 180, y: viewport.y + viewport.height / 2 - 110 });
  const tool = 'grid size-10 cursor-pointer place-items-center rounded-sm border border-ink/10 bg-white text-ink hover:border-blaze focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blaze';

  return (
    <div className="grid gap-4 xl:grid-cols-[minmax(0,1fr)_20rem]">
      <div className="min-w-0 space-y-3">
        <div className="flex flex-wrap items-center gap-2">
          <button type="button" className={primaryButton} onClick={() => state.addSection(center())}>
            <Plus aria-hidden="true" className="size-4" />Tambah area
          </button>
          <div className="w-44">
            <Select
              aria-label="Tambah elemen denah"
              value=""
              placeholder="Tambah elemen"
              options={shapeOptions}
              onChange={(type) => state.addShape(type as SeatShapeType, { x: viewport.x + viewport.width / 2, y: viewport.y + viewport.height * 0.18 })}
            />
          </div>
          <div className="flex gap-1.5">
            <button type="button" aria-label="Perkecil kanvas" className={tool} onClick={() => zoomBy(1 / 1.25)}><Minus aria-hidden="true" className="size-4" /></button>
            <button type="button" aria-label="Perbesar kanvas" className={tool} onClick={() => zoomBy(1.25)}><Plus aria-hidden="true" className="size-4" /></button>
            <button type="button" aria-label="Pas-kan denah ke layar" className={tool} onClick={fit}><Maximize2 aria-hidden="true" className="size-4" /></button>
          </div>
          <span className="ml-auto text-xs text-ink/60" aria-live="polite">
            {state.saving ? 'Menyimpan…' : state.dirty ? 'Ada perubahan belum disimpan' : 'Semua perubahan tersimpan'}
          </span>
          <button type="button" className={primaryButton} disabled={state.saving || !state.dirty} onClick={() => void state.save()}>
            <Save aria-hidden="true" className="size-4" />{state.saving ? 'Menyimpan…' : 'Simpan denah'}
          </button>
        </div>
        {state.error && <DashboardNotice error>{state.error}{Object.values(state.fieldErrors)[0] ? `: ${Object.values(state.fieldErrors)[0]}` : ''}</DashboardNotice>}

        <div
          ref={container}
          tabIndex={0}
          role="application"
          aria-label="Kanvas denah kursi. Seret untuk menggeser, scroll untuk zoom, Delete untuk menghapus kursi terpilih."
          onKeyDown={onKeyDown}
          className="overflow-hidden rounded-md border border-ink/10 bg-paper focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blaze"
        >
          <Stage
            width={size.width}
            height={size.height}
            x={view.x}
            y={view.y}
            scaleX={view.scale}
            scaleY={view.scale}
            draggable
            onWheel={onWheel}
            onDragMove={onStageDragEnd}
            onDragEnd={onStageDragEnd}
            onMouseDown={clearOnEmpty}
            onTouchStart={clearOnEmpty}
          >
            <Layer>
              <Rect name="canvas" width={draft.width} height={draft.height} fill={color.white} shadowColor={color.ink} shadowOpacity={0.08} shadowBlur={24} />
              {gridLines.map((points) => <Line key={points.join()} points={points} stroke={color.grid} strokeWidth={1 / view.scale} listening={false} />)}
            </Layer>
            <Layer>
              {shownShapes.map(renderShape)}
              <Transformer
                ref={transformer}
                rotationSnaps={[0, 45, 90, 135, 180, 225, 270, 315]}
                borderStroke={color.blaze}
                anchorStroke={color.blaze}
                anchorFill={color.white}
                anchorSize={9}
                keepRatio={false}
                boundBoxFunc={(oldBox, newBox) => (newBox.width < 20 || newBox.height < 20 ? oldBox : newBox)}
              />
            </Layer>
            <Layer>
              {shownSections.map((item) => {
                const active = item.key === selectedSection;
                return (
                  <Group
                    key={item.key}
                    draggable
                    onDragEnd={(event) => {
                      if (event.target !== event.currentTarget) return;
                      state.moveSection(item.key, item.x + event.target.x(), item.y + event.target.y());
                      event.target.position({ x: 0, y: 0 });
                    }}
                  >
                    <Rect
                      x={item.x}
                      y={item.y}
                      width={item.width}
                      height={item.height}
                      cornerRadius={10}
                      fill={color.paper}
                      stroke={active ? color.blaze : color.line}
                      strokeWidth={active ? 3 / view.scale : 1.5 / view.scale}
                      onClick={() => state.selectSection(item.key)}
                      onTap={() => state.selectSection(item.key)}
                    />
                    <Text x={item.x + 14} y={item.y + 12} text={item.label} fontSize={16} fontStyle="bold" fill={color.ink} listening={false} />
                    {shownSeats.filter((seat) => seat.sectionKey === item.key).map(renderSeat)}
                  </Group>
                );
              })}
              {shownSeats.filter((seat) => !seat.sectionKey).map(renderSeat)}
            </Layer>
          </Stage>
        </div>
        <p className="text-xs text-ink/55">
          Seret area untuk memindahkan seluruh kursinya, Shift+klik untuk memilih beberapa kursi. Menampilkan {shownSeats.length} dari {draft.seats.length} kursi di layar.
        </p>
      </div>

      <aside aria-label="Pengaturan elemen terpilih" className="space-y-4 rounded-md border border-ink/10 bg-white p-4 xl:sticky xl:top-4 xl:self-start">
        {shape ? (
          <>
            <h3 className="font-display text-lg font-bold">{SHAPE_PRESETS[shape.type].name}</h3>
            <OrganizerField id="shape-label" label="Teks">
              <input id="shape-label" value={shape.label} onChange={(e) => state.updateShape(shape.key, { label: e.target.value })} className={organizerInput} />
            </OrganizerField>
            <ColorField id="shape-color" label="Warna" value={shape.color} onChange={(value) => state.updateShape(shape.key, { color: value })} />
            <div className="grid grid-cols-3 gap-3">
              <OrganizerField id="shape-width" label="Lebar">
                <input id="shape-width" type="number" min={20} value={shape.width} onChange={(e) => state.updateShape(shape.key, { width: Math.max(20, Number(e.target.value)) })} className={organizerInput} />
              </OrganizerField>
              <OrganizerField id="shape-height" label="Tinggi">
                <input id="shape-height" type="number" min={20} value={shape.height} onChange={(e) => state.updateShape(shape.key, { height: Math.max(20, Number(e.target.value)) })} className={organizerInput} />
              </OrganizerField>
              <OrganizerField id="shape-rotation" label="Putar (°)">
                <input id="shape-rotation" type="number" min={-360} max={360} value={Math.round(shape.rotation)} onChange={(e) => state.updateShape(shape.key, { rotation: Number(e.target.value) })} className={organizerInput} />
              </OrganizerField>
            </div>
            <p className="text-xs text-ink/55">Tarik titik di sudut untuk mengubah ukuran, titik atas untuk memutar.</p>
            <button type="button" className={`${ghostButton} w-full text-[#B91C1C]`} onClick={() => state.deleteShape(shape.key)}>
              <Trash2 aria-hidden="true" className="size-4" />Hapus elemen
            </button>
          </>
        ) : section ? (
          <>
            <h3 className="font-display text-lg font-bold">Area terpilih</h3>
            <OrganizerField id="area-label" label="Nama area">
              <input id="area-label" value={section.label} onChange={(e) => state.updateSection(section.key, { label: e.target.value })} className={organizerInput} />
            </OrganizerField>
            <OrganizerField id="area-ticket" label="Kelas tiket">
              <Select id="area-ticket" variant="field" value={section.ticket_type_id ?? ''} onChange={(value) => state.updateSection(section.key, { ticket_type_id: value || null })} options={ticketOptions} />
            </OrganizerField>
            <div className="grid grid-cols-2 gap-3">
              <OrganizerField id="area-width" label="Lebar">
                <input id="area-width" type="number" min={80} value={section.width} onChange={(e) => state.updateSection(section.key, { width: Math.max(80, Number(e.target.value)) })} className={organizerInput} />
              </OrganizerField>
              <OrganizerField id="area-height" label="Tinggi">
                <input id="area-height" type="number" min={60} value={section.height} onChange={(e) => state.updateSection(section.key, { height: Math.max(60, Number(e.target.value)) })} className={organizerInput} />
              </OrganizerField>
            </div>
            <fieldset className="space-y-3 rounded-md bg-paper p-3">
              <legend className="sr-only">Tambah blok kursi</legend>
              <p className="text-sm font-semibold">Tambah blok kursi</p>
              <div className="grid grid-cols-2 gap-3">
                <OrganizerField id="block-rows" label="Baris">
                  <input id="block-rows" type="number" min={1} max={50} value={block.rows} onChange={(e) => setBlock({ ...block, rows: Number(e.target.value) })} className={`${organizerInput} bg-white`} />
                </OrganizerField>
                <OrganizerField id="block-cols" label="Kursi per baris">
                  <input id="block-cols" type="number" min={1} max={100} value={block.cols} onChange={(e) => setBlock({ ...block, cols: Number(e.target.value) })} className={`${organizerInput} bg-white`} />
                </OrganizerField>
              </div>
              <button type="button" className={`${ghostButton} w-full`} onClick={() => state.addSeatBlock(section.key, block.rows, block.cols)}>
                <Grid2x2Plus aria-hidden="true" className="size-4" />Tambah {block.rows * block.cols || 0} kursi
              </button>
            </fieldset>
            <div className="flex flex-wrap gap-2">
              <button type="button" className={ghostButton} onClick={() => state.selectSeats(draft.seats.filter((seat) => seat.sectionKey === section.key).map((seat) => seat.key))}>
                <SquareDashedMousePointer aria-hidden="true" className="size-4" />Pilih kursi area
              </button>
              <button type="button" className={`${ghostButton} text-[#B91C1C]`} onClick={() => state.deleteSection(section.key)}>
                <Trash2 aria-hidden="true" className="size-4" />Hapus area
              </button>
            </div>
          </>
        ) : selectedSeats.length ? (
          <>
            <h3 className="font-display text-lg font-bold">{selectedSeats.length} kursi dipilih</h3>
            <div role="group" aria-label="Status kursi" className="grid grid-cols-2 gap-2">
              <button type="button" className={ghostButton} onClick={() => state.setSelectedStatus('available')}>Tersedia</button>
              <button type="button" className={ghostButton} onClick={() => state.setSelectedStatus('blocked')}>Blokir</button>
            </div>
            <OrganizerField id="seat-ticket" label="Kelas tiket">
              <Select id="seat-ticket" variant="field" value="" placeholder="Ubah kelas tiket" onChange={(value) => state.setSelectedTicketType(value || null)} options={ticketOptions} />
            </OrganizerField>
            <button type="button" className={`${ghostButton} w-full text-[#B91C1C]`} onClick={state.deleteSelectedSeats}>
              <Trash2 aria-hidden="true" className="size-4" />Hapus kursi
            </button>
          </>
        ) : (
          <>
            <h3 className="font-display text-lg font-bold">Kanvas</h3>
            <div className="grid grid-cols-2 gap-3">
              <OrganizerField id="canvas-width" label="Lebar">
                <input id="canvas-width" type="number" min={200} value={draft.width} onChange={(e) => state.setCanvasSize(Number(e.target.value), draft.height)} className={organizerInput} />
              </OrganizerField>
              <OrganizerField id="canvas-height" label="Tinggi">
                <input id="canvas-height" type="number" min={200} value={draft.height} onChange={(e) => state.setCanvasSize(draft.width, Number(e.target.value))} className={organizerInput} />
              </OrganizerField>
            </div>
            <ol className="list-decimal space-y-1.5 pl-4 text-sm text-ink/70">
              <li>Tambah area untuk tiap tribun atau zona.</li>
              <li>Pilih area, atur kelas tiket, lalu tambah blok kursi.</li>
              <li>Seret area atau kursi ke posisinya, lalu simpan denah.</li>
            </ol>
            <p className="text-xs text-ink/55">{draft.sections.length} area, {draft.seats.length} kursi.</p>
          </>
        )}
      </aside>
    </div>
  );

  // Grup berpusat di tengah elemen agar rotasi berporos di tengah.
  function renderShape(item: DraftShape) {
    const active = item.key === selectedShape;
    const isText = item.type === 'text';
    const textColor = isText ? item.color : readableText(item.color);
    const select = () => state.selectShape(item.key);
    return (
      <Group
        key={item.key}
        ref={(node) => { if (node) shapeNodes.current.set(item.key, node); else shapeNodes.current.delete(item.key); }}
        x={item.x + item.width / 2}
        y={item.y + item.height / 2}
        rotation={item.rotation}
        draggable
        onClick={select}
        onTap={select}
        onDragEnd={(event) => state.updateShape(item.key, { x: event.target.x() - item.width / 2, y: event.target.y() - item.height / 2 })}
        onTransformEnd={(event) => {
          const node = event.target;
          const width = Math.max(20, item.width * node.scaleX());
          const height = Math.max(20, item.height * node.scaleY());
          node.scale({ x: 1, y: 1 });
          state.updateShape(item.key, { width, height, rotation: node.rotation(), x: node.x() - width / 2, y: node.y() - height / 2 });
        }}
      >
        {item.type === 'circle'
          ? <Ellipse radiusX={item.width / 2} radiusY={item.height / 2} fill={item.color} stroke={active ? color.blaze : undefined} strokeWidth={2 / view.scale} />
          : !isText && <Rect x={-item.width / 2} y={-item.height / 2} width={item.width} height={item.height} cornerRadius={item.type === 'stage' ? 4 : 10} fill={item.color} opacity={item.type === 'standing' ? 0.85 : 1} />}
        {isText && <Rect x={-item.width / 2} y={-item.height / 2} width={item.width} height={item.height} fill={color.white} opacity={0.01} />}
        {item.label && (
          <Text x={-item.width / 2} y={-item.height / 2} width={item.width} height={item.height} align="center" verticalAlign="middle" text={item.label} fontSize={item.type === 'stage' ? 26 : 16} fontStyle="bold" fill={textColor} listening={false} />
        )}
      </Group>
    );
  }

  function renderSeat(seat: SeatMapEditorState['draft']['seats'][number]) {
    const active = selected.has(seat.key);
    return (
      <Group key={seat.key}>
        <Rect
          x={seat.x}
          y={seat.y}
          width={seat.width}
          height={seat.height}
          cornerRadius={6}
          fill={seat.status === 'blocked' ? color.mute : (seat.ticket_type_id && ticketColors.get(seat.ticket_type_id)) || color.success}
          stroke={active ? color.blaze : undefined}
          strokeWidth={active ? 3 / view.scale : 0}
          draggable
          onDragStart={(event) => { event.cancelBubble = true; }}
          onDragMove={(event) => { event.cancelBubble = true; }}
          onDragEnd={(event) => {
            event.cancelBubble = true;
            state.moveSeat(seat.key, event.target.x(), event.target.y());
          }}
          onClick={(event) => { event.cancelBubble = true; state.selectSeats([seat.key], event.evt.shiftKey); }}
          onTap={(event) => { event.cancelBubble = true; state.selectSeats([seat.key]); }}
        />
        {showSeatLabels && (
          <Text x={seat.x} y={seat.y + seat.height / 2 - 5} width={seat.width} align="center" text={seat.label} fontSize={10} fontStyle="bold" fill={color.ink} listening={false} />
        )}
      </Group>
    );
  }
}
