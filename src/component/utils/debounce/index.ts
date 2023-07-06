//every time you disturb, I will stop it, 防抖
let debounceTimer: number;
const debounce = (callback: () => void, time: number) => {
  clearTimeout(debounceTimer);
  console.log(debounceTimer);
  debounceTimer = window.setTimeout(callback, time);
  console.log(debounceTimer);
};

//any following nonstop disturb won't stop my first trigger， 节流
let throttleTimer: boolean = false;
const throttle = (callback: () => void, time: number) => {
    if (throttleTimer) return;
    throttleTimer = true;
    callback();
    setTimeout(() => {
        //
        throttleTimer = false;
    }, time);
}

export {debounce, throttle};