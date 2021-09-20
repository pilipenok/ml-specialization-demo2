export interface Dataset {
  id: number;
  name: string;
  description: string;
  status: number;
  creation_timestamp: Date;
}

export const datasets: Dataset[] = [
  {
    id: 1,
    name: 'Best Buy',
    description: 'My first dataset',
    status: 0,
    creation_timestamp: new Date('2021-10-11'),
    
  },
  {
    id: 2,
    name: 'Target',
    description: 'Bla bla bla blab lab labalba ',
    status: 0,
    creation_timestamp: new Date('2021-10-11'),
    
  },
  {
    id: 3,
    name: 'Khol\'s',
    description: '',
    status: 0,
    creation_timestamp: new Date('2021-10-11'),
    
  }
];
