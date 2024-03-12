export function deviceIsMobile(): boolean {
  try {
    const userAgent = navigator.userAgent;
    return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
      userAgent
    );
  } catch (error) {
    console.error("Error in deviceIsMobile", error);
    return false;
  }
}
