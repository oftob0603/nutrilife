// P2 (vazn kiritish) panelini ochish hodisasi. Panel P1 va P3 sahifalarida bitta joyda
// chiziladi, tugmalar esa har xil kartalarda — shuning uchun ular bir-birini hodisa orqali topadi.

export const VAZN_PANELINI_OCH = "vazn-panelini-och";

/** Tahrirlash uchun mavjud o'lchov; berilmasa — bugungi vazn kiritiladi. */
export type VaznPaneliTafsiloti = { id: string; vazn: number; sana: string } | undefined;

export function vaznPaneliniOch(tafsilot?: VaznPaneliTafsiloti) {
  window.dispatchEvent(new CustomEvent<VaznPaneliTafsiloti>(VAZN_PANELINI_OCH, { detail: tafsilot }));
}
