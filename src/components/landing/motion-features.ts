// Dimuat terpisah (async) oleh LazyMotion agar fitur animasi Framer tidak menahan render awal.
import { domMax } from 'framer-motion';

export default domMax;
