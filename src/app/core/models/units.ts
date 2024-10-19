export interface Unit {
    id: number,
    factor: number,
    unit: string,
}

export const foodUnits: { [id: number]: Unit } = {
    1: { id: 1, unit: "Kilogramm (kg)", factor: 1 },
    2: { id: 2, unit: "Gramm (g)", factor: 0.001 },
    3: { id: 3, unit: "Milligramm (mg)", factor: 0.000001 },
    4: { id: 4, unit: "Liter (l)", factor: 1 },
    5: { id: 5, unit: "Milliliter (ml)", factor: 0.001 },
};
