import '@testing-library/jest-dom'
import { vi } from 'vitest'
import { fetch } from 'undici'
globalThis.fetch = fetch
