import { TextDecoder, TextEncoder } from 'util';

(global as any).TextDecoder = TextDecoder;
(global as any).TextEncoder = TextEncoder;

require('@testing-library/jest-dom')