import {useEffect, useRef, useState} from 'react';
import {useMapsLibrary} from '../../../../src';

export type UseAutocompleteSuggestionsReturn = {
  suggestions: google.maps.places.AutocompleteSuggestion[];
  isLoading: boolean;
  resetSession: () => void;
};

/**
 * A reusable hook that retrieves autocomplete suggestions from the Google Places API.
 * The data is loaded from the new Autocomplete Data API.
 * (https://developers.google.com/maps/documentation/javascript/place-autocomplete-data)
 *
 * @param inputString The input string for which to fetch autocomplete suggestions.
 * @param requestOptions Additional options for the autocomplete request
 *                       (See {@link https://developers.google.com/maps/documentation/javascript/reference/places-service#AutocompleteRequest|google.maps.places.AutocompleteRequest}).
 *
 * @returns An object containing the autocomplete suggestions, the current loading-status and a function to reset the session.
 *
 * @example
 * ```jsx
 * const MyComponent = () => {
 *   const [input, setInput] = useState('');
 *   const { suggestions, isLoading, resetSession } = useAutocompleteSuggestions(input, {
 *     includedPrimaryTypes: ['restaurant']
 *   });
 *
 *   return (
 *     <div>
 *       <input value={input} onChange={(e) => setInput(e.target.value)} />
 *       <ul>
 *         {suggestions.map(({placePrediction}) => (
 *           <li key={placePrediction.placeId}>{placePrediction.text.text}</li>
 *         ))}
 *       </ul>
 *     </div>
 *   );
 * }
 * ```
 */
export function useAutocompleteSuggestions(
  inputString: string,
  requestOptions: Partial<google.maps.places.AutocompleteRequest> = {}
): UseAutocompleteSuggestionsReturn {
  const placesLib = useMapsLibrary('places');

  // stores the current sessionToken
  const sessionTokenRef =
    useRef<google.maps.places.AutocompleteSessionToken>(null);

  // the suggestions based on the specified input
  const [suggestions, setSuggestions] = useState<
    google.maps.places.AutocompleteSuggestion[]
  >([]);

  // indicates if there is currently an incomplete request to the places API
  const [isLoading, setIsLoading] = useState(false);

  // once the PlacesLibrary is loaded and whenever the input changes, a query
  // is sent to the Autocomplete Data API.
  useEffect(() => {
    if (!placesLib) return;

    const {AutocompleteSessionToken, AutocompleteSuggestion} = placesLib;

    // Create a new session if one doesn't already exist. This has to be reset
    // after `fetchFields` for one of the returned places is called by calling
    // the `resetSession` function returned from this hook.
    if (!sessionTokenRef.current) {
      sessionTokenRef.current = new AutocompleteSessionToken();
    }

    const request: google.maps.places.AutocompleteRequest = {
      ...requestOptions,
      input: inputString,
      sessionToken: sessionTokenRef.current
    };

    if (inputString === '') {
      if (suggestions.length > 0) setSuggestions([]);
      return;
    }

    setIsLoading(true);
    AutocompleteSuggestion.fetchAutocompleteSuggestions(request).then(res => {
      setSuggestions(res.suggestions);
      setIsLoading(false);
    });
  }, [placesLib, inputString]);

  return {
    suggestions,
    isLoading,
    resetSession: () => {
      sessionTokenRef.current = null;
      setSuggestions([]);
    }
  };
}
