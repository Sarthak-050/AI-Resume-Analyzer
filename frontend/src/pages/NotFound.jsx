import { useNavigate } from "react-router-dom";
import { SearchX, Home } from "lucide-react";
import Button from "../components/ui/Button";
import Card from "../components/ui/Card";
import EmptyState from "../components/ui/EmptyState";

function NotFound() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-ink-950 flex items-center justify-center p-6">
      <Card className="max-w-md w-full">
        <EmptyState
          icon={SearchX}
          title="Page not found"
          description="The page you're looking for doesn't exist or may have been moved."
          action={
            <Button onClick={() => navigate("/")}>
              <Home className="w-4 h-4" />
              Back to Home
            </Button>
          }
        />
      </Card>
    </div>
  );
}

export default NotFound;