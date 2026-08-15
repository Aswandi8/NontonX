import { Title, Heading, Label, Text } from "@/components/typography";
import { ModeToggle } from "@/components/theme/mode-toggle";

interface FormLayoutProps {
  title: string;
  subTitle: string;
  children: React.ReactNode;
}

export default function FormLayout({
  title,
  subTitle,
  children,
}: FormLayoutProps) {
  return (
    <div className="flex min-h-screen items-center justify-center px-4 py-10">
      <div className="w-full max-w-md rounded-xl border border-border bg-card p-8 shadow-xl">
        {/* Header */}
        <div className="mb-6 text-center">
          <Title>{title}</Title>
          <Label>{subTitle}</Label>

          {/* Theme Toggle */}
          <div className="mt-5 flex justify-center">
            <ModeToggle />
          </div>
        </div>

        {children}
      </div>
    </div>
  );
}
