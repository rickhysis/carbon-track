
export interface OptionCity {
    value: string;
    readonly label: string;
    readonly isFixed?: boolean;
    readonly isDisabled?: boolean;
}

export interface City {
    city_id: string;
    province_id: string;
    province: string;
    type: string;
    city_name: string,
    postal_code: string
}