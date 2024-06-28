import { atom } from "recoil";

export const scheduleStatus = atom({
  key: "scheduleStatus",
  default: [
    [
      "축구",
      "결승전",
      "컴퓨터공학과",
      "이탈리아어통번역학과",
      "24.07.30(화)",
      0,
    ],
    ["농구", "결승전", "데이터융합학부", "반도체공학과", "24.07.30(화)", 1],
    ["피구", "4강", "통계학과", "컴퓨터공학과", "24.07.29(화)", 2],
    ["축구", "4강", "컴퓨터공학과", "스페인통번역학과", "24.07.28(화)", 3],
    ["계주", "8강", "컴퓨터공학과", "바이오메디컬공학과", "24.07.26(화)", 4],
    [
      "줄다리기",
      "결승전",
      "컴퓨터공학과",
      "이탈리아어통번역학과",
      "24.07.15(화)",
      5,
    ],
  ],
});

export const resultList = atom({
  key: "results",
  default: [],
});
