import { Card } from "@/shared/ui/card/card";
import { Button } from "@/shared/ui/primitives/button";
import { Separator } from "@/shared/ui/primitives/separator";
import { Layout } from "@/widgets/layout";
import {
    BookOpen,
    ChevronRight,
    Container,
    Network,
    Settings
} from "lucide-react";

export const TutorialPage = () => {
  return (
    <Layout>
      <div className="flex flex-col gap-6 p-6">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-semibold tracking-tight">Docker 스웜 튜토리얼</h1>
          <Button variant="outline">
            다음 단계
            <ChevronRight className="ml-2 h-4 w-4" />
          </Button>
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          <Card className="col-span-1">
            <div className="flex flex-col gap-4 p-6">
              <div className="flex items-center gap-4">
                <div className="rounded-lg bg-primary/10 p-2">
                  <BookOpen className="h-6 w-6 text-primary" />
                </div>
                <h3 className="font-semibold">기본 개념</h3>
              </div>
              <Separator />
              <p className="text-sm text-muted-foreground">
                Docker Swarm의 핵심 개념과 아키텍처를 이해합니다.
                노드, 서비스, 컨테이너의 관계와 역할을 학습합니다.
              </p>
            </div>
          </Card>

          <Card className="col-span-1">
            <div className="flex flex-col gap-4 p-6">
              <div className="flex items-center gap-4">
                <div className="rounded-lg bg-primary/10 p-2">
                  <Container className="h-6 w-6 text-primary" />
                </div>
                <h3 className="font-semibold">컨테이너 관리</h3>
              </div>
              <Separator />
              <p className="text-sm text-muted-foreground">
                컨테이너의 생성, 배포, 스케일링 방법을 배웁니다.
                상태 모니터링과 로그 확인 방법을 실습합니다.
              </p>
            </div>
          </Card>

          <Card className="col-span-1">
            <div className="flex flex-col gap-4 p-6">
              <div className="flex items-center gap-4">
                <div className="rounded-lg bg-primary/10 p-2">
                  <Network className="h-6 w-6 text-primary" />
                </div>
                <h3 className="font-semibold">네트워크 설정</h3>
              </div>
              <Separator />
              <p className="text-sm text-muted-foreground">
                오버레이 네트워크 구성과 서비스 디스커버리를 학습합니다.
                로드 밸런싱과 포트 매핑을 실습합니다.
              </p>
            </div>
          </Card>

          <Card className="col-span-1 md:col-span-2 lg:col-span-3">
            <div className="flex flex-col gap-4 p-6">
              <div className="flex items-center gap-4">
                <div className="rounded-lg bg-primary/10 p-2">
                  <Settings className="h-6 w-6 text-primary" />
                </div>
                <h3 className="font-semibold">실습 환경</h3>
              </div>
              <Separator />
              <div className="grid gap-4 md:grid-cols-2">
                <div>
                  <h4 className="mb-2 font-medium">시스템 요구사항</h4>
                  <ul className="list-inside list-disc text-sm text-muted-foreground">
                    <li>Docker Engine 24.0.0 이상</li>
                    <li>최소 2GB RAM</li>
                    <li>멀티 코어 CPU</li>
                    <li>안정적인 네트워크 연결</li>
                  </ul>
                </div>
                <div>
                  <h4 className="mb-2 font-medium">사전 준비사항</h4>
                  <ul className="list-inside list-disc text-sm text-muted-foreground">
                    <li>Docker Desktop 설치</li>
                    <li>기본 Linux 명령어 이해</li>
                    <li>터미널 사용 경험</li>
                    <li>네트워크 기본 지식</li>
                  </ul>
                </div>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </Layout>
  );
};

export default TutorialPage; 