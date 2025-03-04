
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { ArrowDown, ArrowUp, Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';

interface StatCardProps {
  title: string;
  value: number;
  icon: React.ReactNode;
  trend: number;
  descriptor: string;
  loading?: boolean;
  trendDown?: boolean;
}

export default function StatCard({ 
  title, 
  value, 
  icon, 
  trend, 
  descriptor, 
  loading = false,
  trendDown = false 
}: StatCardProps) {
  return (
    <Card>
      <CardContent className="p-6">
        <div className="flex justify-between items-start">
          <div>
            <p className="text-sm font-medium text-gray-500">{title}</p>
            {loading ? (
              <div className="mt-2 h-8 flex items-center">
                <Loader2 className="h-5 w-5 text-gray-400 animate-spin" />
              </div>
            ) : (
              <h4 className="text-2xl font-bold mt-1">{value.toLocaleString()}</h4>
            )}
          </div>
          <div className="p-2 bg-blue-50 rounded-full">
            {icon}
          </div>
        </div>
        
        {!loading && (
          <div className="flex items-center mt-4">
            <div 
              className={cn(
                "flex items-center text-xs font-medium rounded-full px-2 py-0.5",
                trend === 0 
                  ? "bg-gray-100 text-gray-600" 
                  : trendDown 
                    ? "bg-red-100 text-red-600" 
                    : "bg-green-100 text-green-600"
              )}
            >
              {trend === 0 ? (
                <span className="text-gray-600">Estável</span>
              ) : (
                <>
                  {trendDown ? (
                    <ArrowDown className="mr-1 h-3 w-3" />
                  ) : (
                    <ArrowUp className="mr-1 h-3 w-3" />
                  )}
                  {trend}%
                </>
              )}
            </div>
            <span className="text-xs text-gray-500 ml-2">{descriptor}</span>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
