import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";

export function Navigation() {
  const [mounted, setMounted] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  const handleLogout = async () => {
    try {
      setIsLoggingOut(true);
      const response = await fetch("/api/auth/logout", {
        method: "POST",
      });

      if (response.ok) {
        // Przekieruj do strony logowania
        window.location.href = "/login";
      }
    } catch (error) {
      console.error("Logout failed:", error);
    } finally {
      setIsLoggingOut(false);
    }
  };

  return (
    <nav className="border-b">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          <div className="flex-1" />
          <div>
            <Button variant="ghost" onClick={handleLogout} disabled={isLoggingOut} className="text-sm font-medium">
              {isLoggingOut ? "Wylogowywanie..." : "Wyloguj się"}
            </Button>
          </div>
        </div>
      </div>
    </nav>
  );
}
