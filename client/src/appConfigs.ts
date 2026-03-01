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
        appName: "'우리동네 분리배출'",
        effectiveDate: "2026년 2월 27일",
        revisionHistory: [
            { date: "2026년 2월 27일", label: "현행" },
        ],
    },
    // ── 새로운 앱 예시 (필요 시 주석 해제 후 수정) ──
    // "another-app": {
    //   companyName: "Another App",
    //   appName: "ANOTHER APP",
    //   effectiveDate: "2026년 3월 1일",
    //   revisionHistory: [
    //     { date: "2026년 3월 1일", label: "현행" },
    //   ],
    // },
};

/** 기본 앱 키 — 쿼리 없이 /privacy 접근 시 사용 */
export const DEFAULT_APP_KEY = "trash_day_kr";

export default APP_CONFIGS;
