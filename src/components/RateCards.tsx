import { TrendingUp, Target, Clock, Users } from 'lucide-react';

interface RateCardsProps {
  firstProjectRates: {
    daily: number;
    hourly: number;
  };
  secondProjectRates: {
    daily: number;
    hourly: number;
  };
}

export default function RateCards({ firstProjectRates, secondProjectRates }: RateCardsProps) {
  // Part-time rates (₱10k for first, ₱5k for subsequent)
  const firstPartTimeRates = {
    daily: 10000 / 22, // Approximate working days per month
    hourly: (10000 / 22) / 8
  };

  const secondPartTimeRates = {
    daily: 5000 / 22,
    hourly: (5000 / 22) / 8
  };

  return (
    <div className="mb-8">
      <h3 className="text-2xl font-bold text-gray-900 mb-4">Rate Cards</h3>

      {/* Full-Time Rates */}
      <div className="mb-6">
        <h4 className="text-lg font-semibold text-gray-700 mb-3">Full-Time Rates</h4>
        <div className="grid md:grid-cols-2 gap-6">
          <div className="bg-white p-6 rounded-xl border-2 border-red-500 shadow-lg transition-all duration-300 hover:shadow-xl hover:border-red-600 hover:bg-red-50 hover:-translate-y-2 group cursor-pointer">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 bg-red-100 rounded-lg group-hover:bg-red-200 transition-colors">
                <Target className="w-6 h-6 text-red-600" />
              </div>
              <h5 className="text-xl font-semibold text-red-600">First Project</h5>
            </div>
            <div className="space-y-2">
              <p className="text-lg">Monthly Rate: <span className="font-bold text-red-600">₱20,000</span></p>
              <p>Daily Rate: <span className="font-bold text-red-600">₱{firstProjectRates.daily.toFixed(2)}</span></p>
              <p>Hourly Rate: <span className="font-bold text-red-600">₱{firstProjectRates.hourly.toFixed(2)}</span></p>
            </div>
          </div>

          <div className="bg-white p-6 rounded-xl border-2 border-red-500 shadow-lg transition-all duration-300 hover:shadow-xl hover:border-red-600 hover:bg-red-50 hover:-translate-y-2 group cursor-pointer">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 bg-red-100 rounded-lg group-hover:bg-red-200 transition-colors">
                <TrendingUp className="w-6 h-6 text-red-600" />
              </div>
              <h5 className="text-xl font-semibold text-red-600">2nd & Succeeding</h5>
            </div>
            <div className="space-y-2">
              <p className="text-lg">Monthly Rate: <span className="font-bold text-red-600">₱10,000</span></p>
              <p>Daily Rate: <span className="font-bold text-red-600">₱{secondProjectRates.daily.toFixed(2)}</span></p>
              <p>Hourly Rate: <span className="font-bold text-red-600">₱{secondProjectRates.hourly.toFixed(2)}</span></p>
            </div>
          </div>
        </div>
      </div>

      {/* Part-Time Rates */}
      <div>
        <h4 className="text-lg font-semibold text-gray-700 mb-3">Part-Time Rates</h4>
        <div className="grid md:grid-cols-2 gap-6">
          <div className="bg-white p-6 rounded-xl border-2 border-green-500 shadow-lg transition-all duration-300 hover:shadow-xl hover:border-green-600 hover:bg-green-50 hover:-translate-y-2 group cursor-pointer">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 bg-green-100 rounded-lg group-hover:bg-green-200 transition-colors">
                <Clock className="w-6 h-6 text-green-600" />
              </div>
              <h5 className="text-xl font-semibold text-green-600">First Project</h5>
            </div>
            <div className="space-y-2">
              <p className="text-lg">Monthly Rate: <span className="font-bold text-green-600">₱10,000</span></p>
              <p>Daily Rate: <span className="font-bold text-green-600">₱{firstPartTimeRates.daily.toFixed(2)}</span></p>
              <p>Hourly Rate: <span className="font-bold text-green-600">₱{firstPartTimeRates.hourly.toFixed(2)}</span></p>
            </div>
          </div>

          <div className="bg-white p-6 rounded-xl border-2 border-green-500 shadow-lg transition-all duration-300 hover:shadow-xl hover:border-green-600 hover:bg-green-50 hover:-translate-y-2 group cursor-pointer">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 bg-green-100 rounded-lg group-hover:bg-green-200 transition-colors">
                <Users className="w-6 h-6 text-green-600" />
              </div>
              <h5 className="text-xl font-semibold text-green-600">2nd & Succeeding</h5>
            </div>
            <div className="space-y-2">
              <p className="text-lg">Monthly Rate: <span className="font-bold text-green-600">₱5,000</span></p>
              <p>Daily Rate: <span className="font-bold text-green-600">₱{secondPartTimeRates.daily.toFixed(2)}</span></p>
              <p>Hourly Rate: <span className="font-bold text-green-600">₱{secondPartTimeRates.hourly.toFixed(2)}</span></p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}