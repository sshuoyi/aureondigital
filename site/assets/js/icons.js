/**
 * AUREON · RIMU — linear icon set (24×24, stroke set by outer <svg>)
 * Contract: web/site/V3_CONTRACT.md §2 — single global object mapping icon name to inner SVG elements
 * Outer wrapper must set: fill="none" stroke="currentColor" stroke-width="1.5"
 * stroke-linecap="round" stroke-linejoin="round". No <svg> shell, no emoji, no external deps.
 * All geometry stays within the 2–22 px safe area of the 24×24 grid.
 */
window.RIMU_ICON_PATHS = {
  entry: '<path d="M7 21V8.5A5 5 0 0 1 17 8.5V21"/><path d="M3.5 21H20.5"/><path d="M3.5 12H12.5"/><path d="M10 9.5L13.5 12L10 14.5"/>',
  rimu: '<path d="M8 3.5H16A2.5 2.5 0 0 1 18.5 6V18A2.5 2.5 0 0 1 16 20.5H8A2.5 2.5 0 0 1 5.5 18V6A2.5 2.5 0 0 1 8 3.5Z"/><path d="M11 9.5L14.5 12L11 14.5V9.5Z"/><path d="M10.5 18H13.5"/>',
  compute: '<path d="M6.5 6.5H17.5V17.5H6.5V6.5Z"/><path d="M9.5 9.5H14.5V14.5H9.5V9.5Z"/><path d="M9.5 3V6.5"/><path d="M14.5 3V6.5"/><path d="M9.5 17.5V21"/><path d="M14.5 17.5V21"/><path d="M3 9.5H6.5"/><path d="M3 14.5H6.5"/><path d="M17.5 9.5H21"/><path d="M17.5 14.5H21"/>',
  projects: '<path d="M12 3.5L20.5 7.75L12 12L3.5 7.75Z"/><path d="M3.5 12L12 16.25L20.5 12"/><path d="M3.5 16.25L12 20.5L20.5 16.25"/>',
  trade: '<path d="M4 9H17"/><path d="M14 6L17 9L14 12"/><path d="M20 15H7"/><path d="M10 12L7 15L10 18"/>',
  consumer: '<path d="M5.5 8H18.5L17.5 20.5H6.5L5.5 8Z"/><path d="M9 8V6A3 3 0 0 1 15 6V8"/>',
  finance: '<path d="M3.5 7.5H20.5V16.5H3.5V7.5Z"/><path d="M9.75 12A2.25 2.25 0 1 0 14.25 12A2.25 2.25 0 1 0 9.75 12Z"/>',
  training: '<path d="M12 4.5L21 9L12 13.5L3 9L12 4.5Z"/><path d="M6.5 11.5V15.5C6.5 17.2 9 18.5 12 18.5C15 18.5 17.5 17.2 17.5 15.5V11.5"/><path d="M21 9V13"/>',
  health: '<path d="M3.5 12A8.5 8.5 0 1 0 20.5 12A8.5 8.5 0 1 0 3.5 12Z"/><path d="M12 8V16"/><path d="M8 12H16"/>',
  attention: '<path d="M3 12C6 7.5 9 5.5 12 5.5C15 5.5 18 7.5 21 12C18 16.5 15 18.5 12 18.5C9 18.5 6 16.5 3 12Z"/><path d="M9 12A3 3 0 1 0 15 12A3 3 0 1 0 9 12Z"/>',
  cash: '<path d="M7.5 7A4.5 2.2 0 1 0 16.5 7A4.5 2.2 0 1 0 7.5 7Z"/><path d="M7.5 7V11A4.5 2.2 0 0 0 16.5 11V7"/><path d="M7.5 11V15A4.5 2.2 0 0 0 16.5 15V11"/><path d="M7.5 15V18A4.5 2.2 0 0 0 16.5 18V15"/>',
  data: '<path d="M5 6C5 4.3 8.1 3 12 3C15.9 3 19 4.3 19 6C19 7.7 15.9 9 12 9C8.1 9 5 7.7 5 6Z"/><path d="M5 6V18C5 19.7 8.1 21 12 21C15.9 21 19 19.7 19 18V6"/><path d="M5 12C5 13.7 8.1 15 12 15C15.9 15 19 13.7 19 12"/>',
  export: '<path d="M4 14.5V20.5H20V14.5"/><path d="M12 3.5V15"/><path d="M8.5 7L12 3.5L15.5 7"/>',
  experience: '<path d="M3.5 5H20.5V16H3.5V5Z"/><path d="M12 16V19.5"/><path d="M8.5 19.5H15.5"/>',
  middleware: '<path d="M9.5 12A2.5 2.5 0 1 0 14.5 12A2.5 2.5 0 1 0 9.5 12Z"/><path d="M9.9 10.9L6.3 8.5"/><path d="M9.9 13.1L6.3 15.5"/><path d="M14.5 12H18"/><path d="M3.5 8A1.5 1.5 0 1 0 6.5 8A1.5 1.5 0 1 0 3.5 8Z"/><path d="M3.5 16A1.5 1.5 0 1 0 6.5 16A1.5 1.5 0 1 0 3.5 16Z"/><path d="M18 12A1.5 1.5 0 1 0 21 12A1.5 1.5 0 1 0 18 12Z"/>',
  intelligence: '<path d="M12 5.5V18.5"/><path d="M5 12H19"/><path d="M3.4 12A1.6 1.6 0 1 0 6.6 12A1.6 1.6 0 1 0 3.4 12Z"/><path d="M10.4 5.5A1.6 1.6 0 1 0 13.6 5.5A1.6 1.6 0 1 0 10.4 5.5Z"/><path d="M10.4 18.5A1.6 1.6 0 1 0 13.6 18.5A1.6 1.6 0 1 0 10.4 18.5Z"/><path d="M17.4 12A1.6 1.6 0 1 0 20.6 12A1.6 1.6 0 1 0 17.4 12Z"/><path d="M10.6 12A1.4 1.4 0 1 0 13.4 12A1.4 1.4 0 1 0 10.6 12Z"/>',
  infrastructure: '<path d="M5 4.5H19V10.5H5V4.5Z"/><path d="M5 13.5H19V19.5H5V13.5Z"/><path d="M8 7.5H10"/><path d="M8 16.5H10"/><path d="M14 7.5H16"/><path d="M14 16.5H16"/>',
  gov: '<path d="M12 3.5L20.5 8H3.5L12 3.5Z"/><path d="M5.5 8V18"/><path d="M9.5 8V18"/><path d="M14.5 8V18"/><path d="M18.5 8V18"/><path d="M3.5 20.5H20.5"/>',
  land: '<path d="M12 3.5C8.4 3.5 5.5 6.4 5.5 10C5.5 14.5 12 20.5 12 20.5C12 20.5 18.5 14.5 18.5 10C18.5 6.4 15.6 3.5 12 3.5Z"/><path d="M9.75 10A2.25 2.25 0 1 0 14.25 10A2.25 2.25 0 1 0 9.75 10Z"/>',
  funding: '<path d="M3.5 7.5H20.5V16.5H3.5V7.5Z"/><path d="M12 9V15"/><path d="M9 12H15"/>',
  rules: '<path d="M5 3.5H14L18.5 8V20.5H5V3.5Z"/><path d="M14 3.5V8H18.5"/><path d="M8 12H15"/><path d="M8 15.5H15"/><path d="M8 19H12.5"/>',
  diplomacy: '<path d="M6 21V3.5"/><path d="M6 4H15L12.5 7.5L15 11H6"/><path d="M18 21V10"/><path d="M18 10H12.5L14 12.5L12.5 15H18"/>',
  risk_wallet: '<path d="M4 7.5H16.5V18.5H4V7.5Z"/><path d="M4 11H16.5"/><path d="M12.5 13.5H16.5V16.5H12.5V13.5Z"/><path d="M19.5 3.5V7.5"/><path d="M19.5 9.4V9.5"/>',
  risk_religion: '<path d="M4 7H11C12.4 7 13.5 8.1 13.5 9.5V19H6.5C5.1 19 4 17.9 4 16.5Z"/><path d="M7 7V19"/><path d="M19.5 3.5V7.5"/><path d="M19.5 9.4V9.5"/>',
  risk_power: '<path d="M12 7L5.5 14.5H10L9 19.5L15.5 12H11Z"/><path d="M19.5 3.5V7.5"/><path d="M19.5 9.4V9.5"/>',
  risk_cloud: '<path d="M7 18.5A4.2 4.2 0 0 1 6.8 10.2A5.8 5.8 0 0 1 16.8 10.6A4.2 4.2 0 0 1 16.8 18.5Z"/><path d="M19.5 3.5V7.5"/><path d="M19.5 9.4V9.5"/>',
  risk_talent: '<path d="M5.9 9A2.6 2.6 0 1 0 11.1 9A2.6 2.6 0 1 0 5.9 9Z"/><path d="M3.5 20.5C3.5 15.8 6 13.6 8.5 13.6C11 13.6 13.5 15.8 13.5 20.5"/><path d="M19.5 3.5V7.5"/><path d="M19.5 9.4V9.5"/>',
  arrow: '<path d="M4 12H19.5"/><path d="M15 7.5L19.5 12L15 16.5"/>',
  check: '<path d="M4.5 12.5L9.5 17.5L20 6.5"/>',
  play: '<path d="M8.5 4.5L19.5 12L8.5 19.5V4.5Z"/>',
  pause: '<path d="M7.5 4.5H10.5V19.5H7.5V4.5Z"/><path d="M13.5 4.5H16.5V19.5H13.5V4.5Z"/>',
  replay: '<path d="M12 4.5A7.5 7.5 0 1 1 4.8 9.8"/><path d="M9.5 7L12 4.5L14.5 7"/>',
  close: '<path d="M5.5 5.5L18.5 18.5"/><path d="M18.5 5.5L5.5 18.5"/>',
  chart: '<path d="M4 4.5V20H20"/><path d="M8 20V13"/><path d="M12.5 20V8.5"/><path d="M17 20V11"/>',
  users: '<path d="M4.8 7.7A3.2 3.2 0 1 0 11.2 7.7A3.2 3.2 0 1 0 4.8 7.7Z"/><path d="M2.8 20.5C2.8 15.9 5.3 13.5 8 13.5C10.7 13.5 13.2 15.9 13.2 20.5"/><path d="M15.2 8.5A2.3 2.3 0 1 0 19.8 8.5A2.3 2.3 0 1 0 15.2 8.5Z"/><path d="M15.5 14C17.9 14.6 19.5 16.6 19.5 20.5"/>',
  wallet: '<path d="M3.5 7.5H17.5V19H3.5V7.5Z"/><path d="M3.5 11H17.5"/><path d="M13 13.5H17.5V16.5H13V13.5Z"/>',
  map: '<path d="M3.5 6.5L9 4.5V17.5L3.5 19.5V6.5Z"/><path d="M9 4.5L15 6.5V19.5L9 17.5"/><path d="M15 6.5L20.5 4.5V17.5L15 19.5"/>',
  shield: '<path d="M12 3.5L20 6.5V11.5C20 16.5 16.5 19.8 12 21C7.5 19.8 4 16.5 4 11.5V6.5L12 3.5Z"/><path d="M8.5 11.5L11 14L15.5 9.5"/>',
  spark: '<path d="M10 3.5L11.8 8.2L16.5 10L11.8 11.8L10 16.5L8.2 11.8L3.5 10L8.2 8.2L10 3.5Z"/><path d="M18 13.5L18.8 15.7L21 16.5L18.8 17.3L18 19.5L17.2 17.3L15 16.5L17.2 15.7L18 13.5Z"/>',
  globe: '<path d="M3.5 12A8.5 8.5 0 1 0 20.5 12A8.5 8.5 0 1 0 3.5 12Z"/><path d="M3.5 12H20.5"/><path d="M12 3.5C9.5 5.5 8.3 8.5 8.3 12C8.3 15.5 9.5 18.5 12 20.5C14.5 18.5 15.7 15.5 15.7 12C15.7 8.5 14.5 5.5 12 3.5Z"/>'
};
