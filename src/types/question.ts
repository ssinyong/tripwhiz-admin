export interface IQuestionImage {
  uploadFileNames: string; //기존 파일명을 나타내는 문자열 타입
  ord: number; //순서
}

export type QuestionStatus = 'pending' | 'answered';

export interface IQuestion {
  qno: number; //질문 번호
  title: string; //제목
  writer: string; //작성자
  created_at: Date; //작성일
  question: string; //질문 내용
  status: QuestionStatus;
  images?: IQuestionImage[];
  del_flag: boolean; //삭제 플래그
  is_public: boolean //공개 여부
  view_count: number //조회수
}