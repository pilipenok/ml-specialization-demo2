export interface Dataset {
  id: number;
  name: string;
  size: number;
  description: string;
  status: string;
  createdDate: Date;
  createdUser: string
}

export const datasets: Dataset[] = [
  {
    id: 1,
    name: 'Best Buy',
    size: 7990010,
    description: 'My first dataset',
    status: 'New',
    createdDate: new Date('2021-10-11'),
    createdUser: 'user@user.com'
  },
  {
    id: 2,
    name: 'Target',
    size: 1236949,
    description: 'Bla bla bla blab lab labalba ',
    status: 'New',
    createdDate: new Date('2021-10-11'),
    createdUser: 'user@user.com'
  },
  {
    id: 3,
    name: 'Khol\'s',
    size: 29758434,
    description: '',
    status: 'New',
    createdDate: new Date('2021-10-11'),
    createdUser: 'user@user.com'
  }
];
