import { Card, Title } from '@tremor/react';

type DailyRecordsProps = {
  records: {
    highest: { price: number; time: string } | null;
    lowest: { price: number; time: string } | null;
    mostSustainable: { score: number; time: string } | null;
  };
};

export function DailyRecordsCard({ records }: DailyRecordsProps) {
  const { highest, lowest, mostSustainable } = records;

  return (
    <Card className="zonneplan-card">
      <Title className="mb-3 text-[#00aa65] font-medium text-center">Dagrecords</Title>
      {highest && lowest && mostSustainable && (
        <div className="space-y-2">
          <div className="grid grid-cols-3 gap-2">
            <div className="zonneplan-inner-card">
              <span className="text-xs text-[#00aa65] block mb-1 text-center">Hoogste uurprijs</span>
              <div className="text-center">
                <span className="text-lg font-bold text-gray-900 block">€{(highest.price / 10000000).toFixed(2)}</span>
                <span className="text-xs text-gray-500 block mt-1">om {highest.time}</span>
              </div>
            </div>
            <div className="zonneplan-inner-card">
              <span className="text-xs text-[#00aa65] block mb-1 text-center">Laagste uurprijs</span>
              <div className="text-center">
                <span className="text-lg font-bold text-gray-900 block">€{(lowest.price / 10000000).toFixed(2)}</span>
                <span className="text-xs text-gray-500 block mt-1">om {lowest.time}</span>
              </div>
            </div>
            <div className="zonneplan-inner-card">
              <span className="text-xs text-[#00aa65] block mb-1 text-center">Duurzaamste uur</span>
              <div className="text-center">
                <span className="text-lg font-bold text-gray-900 block">{mostSustainable.score.toFixed(2)}</span>
                <span className="text-xs text-gray-500 block mt-1">om {mostSustainable.time}</span>
              </div>
            </div>
          </div>
        </div>
      )}
    </Card>
  );
}
