import { Button } from "@repo/ui/button";
import { TestButton } from "@repo/ui/test-button";

export default function Home() {
  return (
    <div>
      <Button appName="admin">안녕</Button>
      <TestButton appName="admin">안녕</TestButton>
    </div>
  );
}
