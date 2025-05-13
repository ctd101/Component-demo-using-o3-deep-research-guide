import { useState, useEffect } from "react";
import { What3wordsAutosuggest } from "@what3words/react-components";
import { Card, CardContent } from "@/components/ui/card";
import { SelectionEvent, Coordinates } from "@/lib/types";
import { Search } from "lucide-react";

export default function Home() {
  const [selectedAddress, setSelectedAddress] = useState<string>("");
  const [coordinates, setCoordinates] = useState<Coordinates | null>(null);
  const [apiKey, setApiKey] = useState<string>("");

  // Get the API key from environment variables
  useEffect(() => {
    // Prioritize different environment variable names that might be used
    const key = import.meta.env.VITE_W3W_API_KEY || 
                import.meta.env.VITE_REACT_APP_W3W_API_KEY || 
                import.meta.env.VITE_API_KEY;
    
    if (key) {
      setApiKey(key);
    } else {
      console.error("No What3Words API key found in environment variables");
    }
  }, []);

  // Handler for when a suggestion is selected
  const handleSelection = ({ detail }: SelectionEvent) => {
    if (!detail || !detail.suggestion) return;
    
    const words = detail.suggestion.words;
    setSelectedAddress(words);

    // Fetch coordinates for the selected address
    fetch(`https://api.what3words.com/v3/convert-to-coordinates?words=${words}&key=${apiKey}`)
      .then(res => res.json())
      .then(data => {
        if (data.coordinates) {
          setCoordinates(data.coordinates);
        }
      })
      .catch(err => console.error("Error fetching coordinates:", err));
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-gray-50 font-['Inter',sans-serif]">
      <Card className="w-full max-w-md bg-white rounded-xl shadow-md overflow-hidden">
        <CardContent className="p-6">
          <div className="mb-6">
            <h2 className="text-2xl font-semibold text-gray-800 mb-2">What3Words Address Search</h2>
            <p className="text-gray-600 text-sm">Search for locations using three word addresses</p>
          </div>

          {/* AutoSuggest input field */}
          <div className="mb-4">
            <div className="relative">
              {apiKey ? (
                <What3wordsAutosuggest
                  api_key={apiKey}
                  onSelected_suggestion={handleSelection}
                >
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Search className="h-5 w-5 text-gray-400" />
                    </div>
                    <input
                      type="text"
                      className="w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#E12B00] focus:border-transparent placeholder-gray-400 text-gray-700"
                      placeholder="Search for a what3words address (e.g. filled.count.soap)"
                      autoComplete="off"
                    />
                  </div>
                </What3wordsAutosuggest>
              ) : (
                <div className="text-center p-4 border border-dashed border-gray-200 rounded-lg text-gray-500">
                  Loading What3Words API...
                </div>
              )}
            </div>
          </div>

          {/* Confirmation box showing the selected address */}
          {selectedAddress ? (
            <div className="mt-6 p-4 border border-gray-200 rounded-lg bg-gray-50">
              <p className="text-gray-700">You selected: <strong>{selectedAddress}</strong></p>
              {coordinates && (
                <p className="text-gray-500 text-sm mt-1">
                  Coordinates: {coordinates.lat}, {coordinates.lng}
                </p>
              )}
            </div>
          ) : (
            <div className="mt-6 text-center p-4 border border-dashed border-gray-200 rounded-lg">
              <p className="text-gray-500">Type and select a what3words address to see it displayed here</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
