import { useLocation, useSearch } from "wouter";
import { ArrowLeft } from "lucide-react";
import APP_CONFIGS, { DEFAULT_APP_KEY } from "../appConfigs";

export default function Privacy() {
  const [, setLocation] = useLocation();
  const searchString = useSearch();
  const params = new URLSearchParams(searchString);
  const appKey = params.get("app") || DEFAULT_APP_KEY;
  const config = APP_CONFIGS[appKey];

  // 잘못된 app 키가 들어왔을 때
  if (!config) {
    return (
      <div className="min-h-screen bg-gray-950 text-gray-100 flex flex-col items-center justify-center p-4">
        <p className="text-xl font-semibold mb-4">
          요청하신 앱의 개인정보처리방침을 찾을 수 없습니다.
        </p>
        <button
          onClick={() => setLocation("/")}
          className="flex items-center gap-2 text-gray-400 hover:text-gray-100 transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
          홈으로 돌아가기
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-950 text-gray-100 p-4">
      {/* 헤더 */}
      <div className="max-w-2xl mx-auto mb-8">
        <button
          onClick={() => setLocation("/")}
          className="flex items-center gap-2 text-gray-400 hover:text-gray-100 transition-colors mb-6"
        >
          <ArrowLeft className="w-5 h-5" />
          돌아가기
        </button>

        <h1 className="text-4xl font-bold text-white mb-2">개인정보처리방침</h1>
      </div>

      {/* 콘텐츠 */}
      <div className="max-w-2xl mx-auto">
        <div className="space-y-6 text-gray-300 text-sm leading-relaxed">
          {/* 소개 */}
          <section>
            <p>
              {config.companyName}(이하 "회사")는 「개인정보 보호법」 제30조에 따라 정보주체의 개인정보를 보호하고 이와 관련한 고충을 신속하고 원활하게 처리할 수 있도록 다음과 같이 개인정보 처리방침을 수립·공개합니다. 본 방침은 {config.appName} 앱(이하 "애플리케이션") 이용에 적용됩니다.
            </p>
          </section>

          {/* 1. 개인정보의 처리 목적 */}
          <section>
            <h2 className="text-2xl font-semibold text-gray-100 mb-3">
              1. 개인정보의 처리 목적
            </h2>
            <p>회사는 다음의 목적을 위하여 개인정보를 처리합니다. 처리하는 개인정보는 다음의 목적 이외의 용도로는 이용되지 않으며, 이용 목적이 변경되는 경우에는 별도의 동의를 받는 등 필요한 조치를 이행할 예정입니다.</p>
            <ul className="list-disc list-inside mt-2 space-y-1">
              <li><strong>회원 가입 및 관리:</strong> 회원제 서비스 이용에 따른 본인 확인, 회원 자격 유지·관리, 서비스 부정 이용 방지, 각종 고지·통지 목적</li>
              <li><strong>서비스 제공:</strong> 서비스 제공, 콘텐츠 제공, 맞춤 서비스 제공 목적</li>
              <li><strong>서비스 개선:</strong> 신규 서비스 개발, 서비스 개선을 위한 통계 분석 및 접속 빈도 파악 목적</li>
              <li><strong>마케팅 및 광고:</strong> 이벤트 및 광고성 정보 제공(선택 동의 시)</li>
              <li><strong>고충 처리:</strong> 민원인의 신원 확인, 민원 사항 확인, 사실 조사를 위한 연락·통지, 처리 결과 통보 목적</li>
            </ul>
          </section>

          {/* 2. 수집하는 개인정보 항목 및 수집 방법 */}
          <section>
            <h2 className="text-2xl font-semibold text-gray-100 mb-3">
              2. 수집하는 개인정보 항목 및 수집 방법
            </h2>

            <h3 className="text-lg font-medium text-gray-200 mt-3 mb-2">
              가. 수집 항목
            </h3>
            <div className="bg-gray-900 rounded-lg p-4 mt-2 space-y-3">
              <div>
                <p className="font-medium text-gray-100">【필수 항목】</p>
                <ul className="list-disc list-inside mt-1 space-y-1">
                  <li>이메일 주소</li>
                  <li>모바일 기기 고유 식별자(해시 처리)</li>
                  {/* <li>이메일 주소, 비밀번호(암호화 저장), 닉네임</li>
                  <li>기기 정보(기기 모델명, OS 종류 및 버전)</li>
                  <li>서비스 이용 기록, 접속 로그, 접속 IP 주소</li> */}
                </ul>
              </div>
              <div>
                <p className="font-medium text-gray-100">【선택 항목】</p>
                <ul className="list-disc list-inside mt-1 space-y-1">
                  {/* <li>프로필 이미지, 연락처 정보</li> */}
                </ul>
                <p className="mt-1 text-xs text-gray-400">
                  ※ 선택 항목에 동의하지 않더라도 서비스 이용에는 제한이 없습니다.
                </p>
              </div>
            </div>

            <h3 className="text-lg font-medium text-gray-200 mt-4 mb-2">
              나. 수집 방법
            </h3>
            <ul className="list-disc list-inside space-y-1">
              <li>회원 가입 및 서비스 이용 과정에서 이용자가 직접 입력</li>
              <li>서비스 이용 과정에서 자동 생성 및 수집(로그 데이터 등)</li>
            </ul>
          </section>

          {/* 3. 개인정보의 보유 및 이용 기간 */}
          <section>
            <h2 className="text-2xl font-semibold text-gray-100 mb-3">
              3. 개인정보의 보유 및 이용 기간
            </h2>
            <p>
              회사는 원칙적으로 개인정보 수집 및 이용 목적이 달성된 후에는 해당 정보를 지체 없이 파기합니다. 단, 관계 법령에 의해 보존할 필요가 있는 경우 일정 기간 동안 개인정보를 보관합니다.
            </p>
            <div className="bg-gray-900 rounded-lg p-4 mt-3">
              <table className="w-full text-xs">
                <thead>
                  <tr className="border-b border-gray-700">
                    <th className="text-left py-2 text-gray-200">보존 근거</th>
                    <th className="text-left py-2 text-gray-200">보존 항목</th>
                    <th className="text-left py-2 text-gray-200">보존 기간</th>
                  </tr>
                </thead>
                <tbody className="text-gray-400">
                  <tr className="border-b border-gray-800">
                    <td className="py-2">전자상거래법</td>
                    <td className="py-2">계약·청약철회 기록</td>
                    <td className="py-2">5년</td>
                  </tr>
                  <tr className="border-b border-gray-800">
                    <td className="py-2">전자상거래법</td>
                    <td className="py-2">대금결제·재화공급 기록</td>
                    <td className="py-2">5년</td>
                  </tr>
                  <tr className="border-b border-gray-800">
                    <td className="py-2">전자상거래법</td>
                    <td className="py-2">소비자 불만·분쟁 처리 기록</td>
                    <td className="py-2">3년</td>
                  </tr>
                  <tr className="border-b border-gray-800">
                    <td className="py-2">통신비밀보호법</td>
                    <td className="py-2">로그인 기록</td>
                    <td className="py-2">3개월</td>
                  </tr>
                  <tr>
                    <td className="py-2">회원 탈퇴 시</td>
                    <td className="py-2">회원 정보 전체</td>
                    <td className="py-2">즉시 파기</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </section>

          {/* 4. 개인정보의 제3자 제공 */}
          <section>
            <h2 className="text-2xl font-semibold text-gray-100 mb-3">
              4. 개인정보의 제3자 제공
            </h2>
            <p>
              회사는 원칙적으로 정보주체의 개인정보를 제3자에게 제공하지 않습니다. 다만, 다음의 경우에는 예외로 합니다.
            </p>
            <ul className="list-disc list-inside mt-2 space-y-1">
              <li>정보주체가 사전에 동의한 경우</li>
              <li>법률에 특별한 규정이 있거나, 법령상 의무를 준수하기 위해 불가피한 경우</li>
              <li>정보주체 또는 그 법정대리인이 의사표시를 할 수 없는 상태에 있거나, 주소불명 등으로 사전 동의를 받을 수 없는 경우로서 명백히 정보주체 또는 제3자의 급박한 생명, 신체, 재산의 이익을 위하여 필요한 경우</li>
            </ul>
          </section>

          {/* 5. 개인정보 처리의 위탁 */}
          <section>
            <h2 className="text-2xl font-semibold text-gray-100 mb-3">
              5. 개인정보 처리의 위탁
            </h2>
            <p>
              회사는 원활한 서비스 제공을 위해 다음과 같이 개인정보 처리 업무를 위탁하고 있습니다.
            </p>
            <div className="bg-gray-900 rounded-lg p-4 mt-3">
              <table className="w-full text-xs">
                <thead>
                  <tr className="border-b border-gray-700">
                    <th className="text-left py-2 text-gray-200">위탁받는 자</th>
                    <th className="text-left py-2 text-gray-200">위탁 업무</th>
                  </tr>
                </thead>
                <tbody className="text-gray-400">
                  <tr className="border-b border-gray-800">
                    <td className="py-2">Google Firebase</td>
                    <td className="py-2">인증·데이터 저장·호스팅·분석</td>
                  </tr>
                </tbody>
              </table>
            </div>
            <p className="mt-2 text-xs text-gray-400">
              위탁 계약 체결 시 「개인정보 보호법」에 따라 위탁 업무 수행 목적 외 개인정보 처리 금지, 기술적·관리적 보호조치, 재위탁 제한, 수탁자에 대한 관리·감독, 손해배상 등 책임에 관한 사항을 규정하고 있습니다.
            </p>
          </section>

          {/* 6. 정보주체의 권리·의무 및 행사 방법 */}
          <section>
            <h2 className="text-2xl font-semibold text-gray-100 mb-3">
              6. 정보주체의 권리·의무 및 행사 방법
            </h2>
            <p>정보주체(이용자)는 다음과 같은 권리를 행사할 수 있습니다.</p>
            <ul className="list-disc list-inside mt-2 space-y-1">
              <li><strong>열람 요구:</strong> 회사가 보유하고 있는 본인의 개인정보를 열람하도록 요구할 수 있습니다.</li>
              <li><strong>정정·삭제 요구:</strong> 개인정보에 오류가 있을 경우 정정 또는 삭제를 요구할 수 있습니다.</li>
              <li><strong>처리 정지 요구:</strong> 개인정보의 처리 정지를 요구할 수 있습니다.</li>
              <li><strong>동의 철회:</strong> 개인정보 수집·이용 동의 등을 철회할 수 있습니다.</li>
            </ul>
            <p className="mt-3">위 권리 행사는 다음 방법으로 하실 수 있으며, 회사는 이에 대해 지체 없이 조치하겠습니다.</p>
            <ul className="list-disc list-inside mt-2 space-y-1">
              <li>이메일: <span className="text-blue-400">{import.meta.env.VITE_PRIVACY_CPO_EMAIL || 'support@cowcompany.kr'}</span></li>
              <li>애플리케이션 내 설정 메뉴 → 계정 관리</li>
            </ul>
            <p className="mt-2 text-xs text-gray-400">
              ※ 만 14세 미만 아동의 경우, 법정대리인이 권리를 행사할 수 있으며, 회사는 법정대리인의 동의 없이 아동의 개인정보를 수집하지 않습니다.
            </p>
          </section>

          {/* 7. 개인정보의 파기 절차 및 방법 */}
          <section>
            <h2 className="text-2xl font-semibold text-gray-100 mb-3">
              7. 개인정보의 파기 절차 및 방법
            </h2>
            <p>회사는 개인정보 보유 기간의 경과, 처리 목적 달성 등 개인정보가 불필요하게 되었을 때에는 지체 없이 해당 개인정보를 파기합니다.</p>
            <div className="mt-3 space-y-3">
              <div>
                <p className="font-medium text-gray-200">파기 절차</p>
                <p className="mt-1">이용자가 입력한 정보는 목적 달성 후 별도의 DB에 옮겨져(종이의 경우 별도의 서류) 내부 방침 및 기타 관련 법령에 따라 일정 기간 저장된 후 파기됩니다.</p>
              </div>
              <div>
                <p className="font-medium text-gray-200">파기 방법</p>
                <ul className="list-disc list-inside mt-1 space-y-1">
                  <li><strong>전자적 파일:</strong> 기록을 재생할 수 없는 기술적 방법을 사용하여 완전히 삭제</li>
                  <li><strong>종이 문서:</strong> 분쇄기로 분쇄하거나 소각하여 파기</li>
                </ul>
              </div>
            </div>
          </section>

          {/* 8. 개인정보의 안전성 확보조치 */}
          <section>
            <h2 className="text-2xl font-semibold text-gray-100 mb-3">
              8. 개인정보의 안전성 확보조치
            </h2>
            <p>회사는 개인정보의 안전성 확보를 위해 다음과 같은 조치를 취하고 있습니다.</p>
            <ul className="list-disc list-inside mt-2 space-y-1">
              <li><strong>관리적 조치:</strong> 내부 관리 계획 수립 및 시행, 개인정보 취급 직원 최소화 및 교육</li>
              <li><strong>기술적 조치:</strong> 개인정보 처리 시스템 접근 권한 관리, 접근 통제 시스템 설치, 고유 식별 정보 등의 암호화, 보안 프로그램 설치</li>
              <li><strong>물리적 조치:</strong> 전산실, 자료보관실 등에 대한 접근 통제</li>
            </ul>
          </section>

          {/* 9. 자동 수집 장치의 설치·운영 및 거부 */}
          <section>
            <h2 className="text-2xl font-semibold text-gray-100 mb-3">
              9. 자동 수집 장치의 설치·운영 및 거부
            </h2>
            <p>
              회사는 이용자에게 개별적인 맞춤 서비스를 제공하기 위해 이용 정보를 저장하고 수시로 불러오는 '쿠키(Cookie)' 등 자동 수집 장치를 사용할 수 있습니다.
            </p>
            <div className="mt-3 space-y-2">
              <div>
                <p className="font-medium text-gray-200">쿠키의 사용 목적</p>
                <p className="mt-1">이용자의 접속 빈도나 방문 시간 분석, 이용 형태 파악, 맞춤형 정보 제공</p>
              </div>
              <div>
                <p className="font-medium text-gray-200">쿠키 설치·운영 거부 방법</p>
                <p className="mt-1">브라우저 설정에서 쿠키 저장을 거부하거나, 저장된 쿠키를 삭제할 수 있습니다. 단, 쿠키를 거부할 경우 일부 서비스 이용에 어려움이 있을 수 있습니다.</p>
              </div>
            </div>
          </section>

          {/* 10. 어린이(아동) 보호 */}
          <section>
            <h2 className="text-2xl font-semibold text-gray-100 mb-3">
              10. 아동의 개인정보 보호
            </h2>
            <p>
              회사는 만 14세 미만 아동의 개인정보를 수집할 경우 법정대리인의 동의를 받습니다. 만 14세 미만 아동의 법정대리인은 아동의 개인정보에 대한 열람, 정정·삭제, 처리 정지를 요구할 수 있습니다.
            </p>
            <p className="mt-2">
              법정대리인의 동의 없이 만 14세 미만 아동의 개인정보가 수집된 것을 알게 된 경우, 즉시 해당 정보를 삭제하며 관련 서비스 이용을 차단합니다. 이와 관련하여 문의 사항이 있으시면 아래 개인정보 보호책임자에게 연락 주시기 바랍니다.
            </p>
          </section>

          {/* 11. 개인정보 보호책임자 */}
          <section>
            <h2 className="text-2xl font-semibold text-gray-100 mb-3">
              11. 개인정보 보호책임자
            </h2>
            <p>
              회사는 개인정보 처리를 담당하는 부서 및 개인정보 보호책임자를 아래와 같이 지정하고 있습니다.
            </p>
            <div className="bg-gray-900 rounded-lg p-4 mt-3 space-y-2">
              <div>
                <p className="font-medium text-gray-100">▶ 개인정보 보호책임자</p>
                <ul className="list-none mt-1 space-y-1">
                  <li>성명: {import.meta.env.VITE_PRIVACY_CPO_NAME || '[담당자 성명]'}</li>
                  <li>직위: {import.meta.env.VITE_PRIVACY_CPO_POSITION || '[직위]'}</li>
                  <li>연락처: <span className="text-blue-400">{import.meta.env.VITE_PRIVACY_CPO_EMAIL || 'support@cowcompany.kr'}</span></li>
                </ul>
              </div>
              <div>
                <p className="font-medium text-gray-100">▶ 개인정보 보호 담당부서</p>
                <ul className="list-none mt-1 space-y-1">
                  <li>부서명: {import.meta.env.VITE_PRIVACY_DEPT_NAME || '[부서명]'}</li>
                  <li>연락처: <span className="text-blue-400">{import.meta.env.VITE_PRIVACY_CPO_EMAIL || 'support@cowcompany.kr'}</span></li>
                </ul>
              </div>
            </div>
            <p className="mt-2 text-xs text-gray-400">
              ※ 서비스 이용 중 발생하는 모든 개인정보 관련 문의, 불만 처리, 피해 구제 등은 위 담당자에게 연락하시면 지체 없이 답변해 드리겠습니다.
            </p>
          </section>

          {/* 12. 권익 침해 구제 방법 */}
          <section>
            <h2 className="text-2xl font-semibold text-gray-100 mb-3">
              12. 권익 침해 구제 방법
            </h2>
            <p>
              정보주체는 개인정보 침해로 인한 구제를 받기 위하여 개인정보 분쟁조정위원회, 한국인터넷진흥원 개인정보 침해신고센터 등에 분쟁 해결이나 상담 등을 신청할 수 있습니다.
            </p>
            <div className="bg-gray-900 rounded-lg p-4 mt-3 space-y-3">
              <div>
                <p className="text-gray-200">▶ 개인정보 분쟁조정위원회</p>
                <p className="text-gray-400">전화: 1833-6972 | 웹사이트: <span className="text-blue-400">www.kopico.go.kr</span></p>
              </div>
              <div>
                <p className="text-gray-200">▶ 개인정보 침해신고센터 (한국인터넷진흥원)</p>
                <p className="text-gray-400">전화: 118 (국번 없이) | 웹사이트: <span className="text-blue-400">privacy.kisa.or.kr</span></p>
              </div>
              <div>
                <p className="text-gray-200">▶ 대검찰청 사이버수사과</p>
                <p className="text-gray-400">전화: 1301 (국번 없이) | 웹사이트: <span className="text-blue-400">www.spo.go.kr</span></p>
              </div>
              <div>
                <p className="text-gray-200">▶ 경찰청 사이버수사국</p>
                <p className="text-gray-400">전화: 182 (국번 없이) | 웹사이트: <span className="text-blue-400">ecrm.cyber.go.kr</span></p>
              </div>
            </div>
          </section>

          {/* 13. 개인정보 처리방침의 변경 */}
          <section>
            <h2 className="text-2xl font-semibold text-gray-100 mb-3">
              13. 개인정보 처리방침의 변경
            </h2>
            <p>
              본 개인정보 처리방침은 법령 및 방침에 따라 변경될 수 있으며, 변경 시에는 시행일 최소 7일 전부터 애플리케이션 내 공지사항 또는 팝업 알림을 통해 고지하겠습니다. 변경된 개인정보 처리방침은 시행일부터 효력이 발생합니다.
            </p>
            <p className="mt-2">
              이용자의 권리에 중대한 변경이 있을 경우에는 최소 30일 전에 고지합니다.
            </p>
          </section>

          {/* 14. 동의 */}
          <section>
            <h2 className="text-2xl font-semibold text-gray-100 mb-3">
              14. 동의
            </h2>
            <p>
              애플리케이션을 사용함으로써 귀하는 본 개인정보 처리방침에 설정된 대로 정보 처리에 동의합니다. 본 방침에 동의하지 않으시는 경우, 서비스 이용을 중단하고 회원 탈퇴를 요청하실 수 있습니다.
            </p>
          </section>

          {/* 15. 계정 삭제 안내 */}
          <section>
            <h2 className="text-2xl font-semibold text-gray-100 mb-3">
              15. {config.appName} 계정 삭제 안내
            </h2>

            <div className="mt-3 space-y-4">
              {/* 앱 내 삭제 방법 */}
              <div>
                <p className="font-medium text-gray-200 mb-2">▶ 앱 내에서 직접 삭제</p>
                <ol className="list-decimal list-inside space-y-1">
                  <li>{config.appName} 앱을 실행합니다.</li>
                  <li>설정 &gt; 메뉴로 이동합니다.</li>
                  <li>'계정 삭제' 또는 '회원 탈퇴' 버튼을 클릭합니다.</li>
                  <li>안내에 따라 인증 후 삭제를 완료합니다.</li>
                </ol>
              </div>

              {/* 이메일 요청 */}
              <div>
                <p className="font-medium text-gray-200 mb-2">▶ 이메일로 삭제 요청</p>
                <div className="bg-gray-900 rounded-lg p-4 space-y-2">
                  <p>삭제 요청 이메일 : <span className="text-blue-400">{import.meta.env.VITE_PRIVACY_CPO_EMAIL || 'support@cowcompany.kr'}</span></p>
                  <p>제목 : {config.appName} 계정 삭제 요청</p>
                  <p>본문에 포함할 내용 :</p>
                  <ul className="list-disc list-inside ml-2 space-y-1">
                    <li>사용 중인 이메일 주소</li>
                    <li>삭제 사유 (선택)</li>
                  </ul>
                </div>
              </div>

              {/* 삭제 처리 안내 */}
              <div>
                <p className="font-medium text-gray-200 mb-2">▶ 삭제 처리</p>
                <ul className="list-disc list-inside space-y-1">
                  <li>요청 후 최대 30일 이내에 계정 및 관련 데이터(프로필, 게시물 등)를 영구 삭제합니다.</li>
                  <li>법령상 보관 의무가 있는 일부 데이터(예: 결제 기록)는 관련 법령이 정한 기간 동안 보관 후 삭제됩니다.</li>
                </ul>
              </div>
            </div>
          </section>

          {/* 시행일 */}
          <section className="border-t border-gray-700 pt-6 mt-8">
            <p className="text-xs text-gray-500">
              본 방침은 {config.effectiveDate}부터 시행됩니다.
            </p>
            <p className="text-xs text-gray-500 mt-1">
              이전 개인정보 처리방침은 아래에서 확인하실 수 있습니다.
            </p>
            <ul className="text-xs text-gray-500 mt-1">
              {config.revisionHistory.map((rev, idx) => (
                <li key={idx}>- {rev.date} 시행 ({rev.label})</li>
              ))}
            </ul>
          </section>
        </div>
      </div>
    </div>
  );
}
