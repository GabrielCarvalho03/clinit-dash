import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export type CardInfoReportsProps = {
  title: string;
  text: string;
};

export const CardInfoReports = ({ text, title }: CardInfoReportsProps) => {
  return (
    <Card className="flex-1">
      <CardHeader className="pb-2">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-2xl font-bold">{text}</p>
      </CardContent>
    </Card>
  );
};
