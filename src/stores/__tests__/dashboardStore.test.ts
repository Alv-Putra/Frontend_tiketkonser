import { createDashboardStore } from '../dashboardStore';

test('memuat, menahan data terakhir saat gagal, dan bisa mencoba lagi', async () => {
  const load = jest.fn<Promise<number>, []>()
    .mockResolvedValueOnce(7)
    .mockRejectedValueOnce(new Error('offline'))
    .mockResolvedValueOnce(8);
  const store = createDashboardStore(load);
  const refresh = store.getState().refresh;

  expect(store.getState()).toMatchObject({ status: 'loading', data: null });
  await refresh();
  expect(store.getState()).toMatchObject({ status: 'ready', data: 7 });
  await refresh();
  expect(store.getState()).toMatchObject({ status: 'error', data: 7 });
  await refresh();
  expect(store.getState()).toMatchObject({ status: 'ready', data: 8 });
});

test('respons lama tidak menimpa data atau status permintaan terbaru', async () => {
  let resolveOld: (value: number) => void;
  let rejectOld: (error: Error) => void;
  const load = jest.fn<Promise<number>, []>()
    .mockReturnValueOnce(new Promise((resolve) => { resolveOld = resolve; }))
    .mockReturnValueOnce(new Promise((_, reject) => { rejectOld = reject; }))
    .mockResolvedValueOnce(10);
  const store = createDashboardStore(load);
  const refresh = store.getState().refresh;

  const oldSuccess = refresh();
  const oldError = refresh();
  await refresh();
  resolveOld(4);
  rejectOld(new Error('offline'));
  await Promise.all([oldSuccess, oldError]);
  expect(store.getState()).toMatchObject({ status: 'ready', data: 10 });
});
