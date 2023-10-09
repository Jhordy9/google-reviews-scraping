import { subDays, subWeeks, subMonths, subYears } from 'date-fns';

type Unit = 'dia' | 'semana' | 'mês' | 'ano';

const units: Record<Unit, (date: Date, value: number) => Date> = {
  dia: subDays,
  semana: subWeeks,
  mês: subMonths,
  ano: subYears,
};

const pluralToSingular: Record<string, Unit> = {
  dias: 'dia',
  semanas: 'semana',
  meses: 'mês',
  anos: 'ano',
};

export const convertStringToDate = (str: string): Date | null => {
  const today = new Date();

  const parts = str.replace(/\buma?\b/g, '1').split(' ');
  if (parts.length !== 3 || parts[2] !== 'atrás') {
    throw new Error('String formatting is invalid');
  }

  const value = parseInt(parts[0], 10);
  const unit = units[parts[1] as Unit]
    ? (parts[1] as Unit)
    : pluralToSingular[parts[1]];

  if (isNaN(value) || !units[unit]) {
    throw new Error('Value or unit is invalid');
  }

  return units[unit](today, value);
};
