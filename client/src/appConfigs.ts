/**
 * 앱별 개인정보처리방침 설정
 *
 * 새로운 앱을 추가할 때는 여기에 항목만 추가하면
 * /privacy?app=<키> 경로로 해당 앱의 개인정보처리방침이 자동 생성됩니다.
 */

export interface AppPrivacyConfig {
    /** 회사(또는 서비스) 표시 이름 — 예: "Pixel One" */
    companyName: string;
    /** 앱 표시 이름 — 예: "PIXEL ONE" */
    appName: string;
    /** 시행일 — 예: "2026년 2월 27일" */
    effectiveDate: string;
    /** 시행 이력 목록 (최신순) */
    revisionHistory: { date: string; label: string }[];
}

const APP_CONFIGS: Record<string, AppPrivacyConfig> = {
    "trash_day_kr": {
        companyName: "Pixel One",
        appName: "'우리동네 분리배출 알림'",
        effectiveDate: "2026년 2월 27일",
        revisionHistory: [
            { date: "2026년 2월 27일", label: "현행" },
        ],
    },
    // "local_festival": {
    //     companyName: "Pixel One",
    //     appName: "'지역축제 알리미'",
    //     effectiveDate: "2026년 3월 10일",
    //     revisionHistory: [
    //         { date: "2026년 3월 10일", label: "현행" },
    //     ],
    // },
    "fiveday_parking_alert": {
        companyName: "Pixel One",
        appName: "'서울 공영주차장 5부제 알리미 - 주차 요일제 필수앱'",
        effectiveDate: "2026년 4월 10일",
        revisionHistory: [
            { date: "2026년 4월 10일", label: "현행" },
        ],
    },
    "high_oil_price_relief_payment": {
        companyName: "Pixel One",
        appName: "'고유가 피해지원금 캘린더'",
        effectiveDate: "2026년 4월 17일",
        revisionHistory: [
            { date: "2026년 4월 17일", label: "현행" },
        ],
    },
    "eitc_ctc_calendar": {
        companyName: "Pixel One",
        appName: "'근로장려금 자녀장려금 일정 알리미'",
        effectiveDate: "2026년 4월 22일",
        revisionHistory: [
            { date: "2026년 4월 22일", label: "현행" },
        ],
    },
};

/** 기본 앱 키 — 쿼리 없이 /privacy 접근 시 사용 */
export const DEFAULT_APP_KEY = "trash_day_kr";

export default APP_CONFIGS;
