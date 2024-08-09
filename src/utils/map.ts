import { INDONESIA_CITY } from "@/constant/city";
import { City, OptionCity } from "@/types/city";
import { LatLngBounds } from "leaflet";

export const INDONESIA_BOOUNDS: LatLngBounds = new LatLngBounds(
    [-11.0, 95.0],  // Southwest coordinates
    [6.0, 141.0]    // Northeast coordinates
);

export function indonesiaCity(): readonly OptionCity[] {
    return INDONESIA_CITY.map((value) => (
        {
            value: value.city_id,
            label: value.city_name,
            isFixed: false,
            isDisabled: false
        }))
}

export function getCityName(id: number): string {
    const result : City | undefined= INDONESIA_CITY.find((value) => id.toString() === value.city_id)
    
    if(result) return result.city_name

    return ''
}


