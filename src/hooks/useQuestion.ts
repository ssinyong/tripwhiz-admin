import { IQuestion } from '../types/question';
import { useState } from 'react';
import { string } from 'prop-types';


const initialState: IQuestion[] = [
{
  qno: 0,
  title: '',
  writer: '',
  created_at: new Date(),
  question: '',
  status: 'pending',
  images: [],
  del_flag: false,
  is_public: true,
  view_count: 0,

  }
];

const UseQuestion = (qno: string | undefined) => {

  const [questions, setQuestions] = useState<IQuestion[]>(initialState);

  return {questions, setQuestions};
};

export default UseQuestion;