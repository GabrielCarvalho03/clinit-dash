import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

interface TreatmentData {
  name: string;
  quoted: number;
  closed: number;
  conversion: number;
}

interface TreatmentRankingProps {
  data: TreatmentData[];
  title?: string;
}

export const TreatmentRanking = ({
  data,
  title = "Tratamentos Mais Orçados",
}: TreatmentRankingProps) => {
  // Show only top 3 treatments as requested
  const displayData = data.slice(0, 3);
  console.log("dentistFilter", data);

  return (
    <Card>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
        <CardDescription>
          Top 3 tratamentos com maiores taxas de conversão
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Tratamento</TableHead>
              <TableHead className="text-right">Orçados</TableHead>
              <TableHead className="text-right">Convertidos</TableHead>
              <TableHead className="text-right">Taxa</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {displayData.length > 0 ? (
              displayData.map((item) => (
                <TableRow key={item.name}>
                  <TableCell className="font-medium">{item.name}</TableCell>
                  <TableCell className="text-right">{item.quoted}</TableCell>
                  <TableCell className="text-right">{item.closed}</TableCell>
                  <TableCell className="text-right">
                    {item.conversion.toFixed(1)}%
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={4}
                  className="text-center py-6 text-muted-foreground"
                >
                  Nenhum tratamento orçado ainda
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
};
