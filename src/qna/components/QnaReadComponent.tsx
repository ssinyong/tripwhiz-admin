
import { Box, Card, CardContent, Typography, TextField, Button, CircularProgress, FormControl, SelectChangeEvent } from '@mui/material';
import { IQuestion } from '../../types/question';
import { useEffect, useState } from 'react';
import { useNavigate, useParams, useSearchParams } from 'react-router-dom';
import axios from 'axios';


// Q&A 데이터 타입 정의
interface IAnswer {
  ano: number;
  title: string;
  writer: string;
  question: string;
  created_date: Date;
  updated_date?: Date;
  status: '답변대기' | '답변완료';
  answer: string;
}

const initState: IAnswer = {
  ano: 0,
  title: '',
  writer: '',
  question: '',
  created_date: new Date(),
  updated_date: undefined,
  status: '답변대기',
  answer: ''
};


function QnaReadComponent() {
  const [qna, setQna] = useState<IAnswer>({ ...initState });
  const [answer, setAnswer] = useState(''); // 관리자 답변 상태
  const [loading, setLoading] = useState(false);
  const { ano } = useParams<{ ano: string }>(); // URL에서 ano 추출
  const navigate = useNavigate();


  // 질문 데이터를 불러오는 함수
  useEffect(() => {
    // 실제 API 호출로 질문 데이터를 불러옴
    axios.get(`/api/qna/${ano}`) // ano 해당하는 데이터를 가져옴
      .then((response) => {
        const fetchedQna: IAnswer = response.data; // API 응답 데이터 사용
        setQna(fetchedQna); // 받아온 데이터를 상태로 설정
      })
      .catch((error) => {
        console.error('Failed to fetch Q&A:', error);
      });
  }, [ano]);


  const handleAnswerChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setAnswer(e.target.value);
  };

  const handleCancel = () => {
    setLoading(true);
    // 답변 취소 API 호출
    setTimeout(() => {
      console.log('답변 취소');
      setLoading(false);
      navigate('/qna/list'); // 제출 후 Q&A 리스트로 이동
    }, 1000);
  };

  const handleSubmit = () => {
    setLoading(true);
    const updatedQna = {
      ...qna,
      answer,
      updated_date: new Date() // 현재 날짜로 업데이트
    };

    axios.post(`/api/qna/${qna.ano}/answer`, updatedQna) // 답변 제출 API 호출
      .then((response) => {
        console.log('답변 제출 완료:', response.data);
        navigate('/qna/list'); // 제출 후 Q&A 리스트로 이동
      })
      .catch((error) => {
        console.error('답변 제출 실패:', error);
      })
      .finally(() => {
        setLoading(false);
      });
  };

  const handleEdit = () => {
    setLoading(true);
    const updatedQna = {
      ...qna,
      answer,
      updated_date: new Date() // 현재 날짜로 업데이트
    };

    axios.put(`/api/qna/${qna.ano}`, updatedQna) // 수정 API 호출
      .then((response) => {
        console.log('수정 완료:', response.data);
        navigate('/qna/list'); // 수정 후 Q&A 리스트로 이동
      })
      .catch((error) => {
        console.error('수정 실패:', error);
      })
      .finally(() => {
        setLoading(false);
      });
  };

  const handleDelete = () => {
    setLoading(true);
    // 삭제 API 호출 (예시)
    axios.delete(`/api/qna/${qna.ano}`)
      .then(() => {
        console.log('삭제 완료');
        navigate('/qna/list'); // 삭제 후 Q&A 리스트로 이동
      })
      .catch((error) => {
        console.error('삭제 실패:', error);
      })
      .finally(() => {
        setLoading(false);
      });
  };


  return (
    <Box
      display="flex"
      justifyContent="center"
      alignItems="center"
      height="100vh"
      bgcolor="#f5f5f5"
    >
      <Card sx={{ width: '95%', p: 4 }}>
        <CardContent>
          <Typography variant="h2" component="div" textAlign="center" gutterBottom>
            Admin Q&A
          </Typography>
          <Box component="form" sx={{ mt: 3 }}>

            {/* 질문 제목 및 작성자 */}
            <Typography variant="h6">질문 No.: {qna.ano}</Typography>
            <Typography variant="h6">질문 제목: {qna.title}</Typography>
            <Typography variant="body1">작성자: {qna.writer}</Typography>
            {/* 질문 내용 */}
            <Typography variant="body2" sx={{ mt: 2, whiteSpace: 'pre-wrap' }}>
              {qna.question}
            </Typography>
            {/* 관리자의 답변 입력란 */}
            {qna.status === '답변대기' && (
              <>
                <Typography variant="h3" component="div" textAlign="left" gutterBottom>
                  Answer Here!
                </Typography>
                <TextField
                  fullWidth
                  label="관리자 답변"
                  value={answer}
                  onChange={handleAnswerChange}
                  margin="normal"
                  variant="outlined"
                  multiline
                  rows={4}
                />
                <Box display="flex" justifyContent="flex-end" mt={3}>
                  <Button variant="outlined" onClick={handleCancel} disabled={loading} sx={{ mr: 1 }}>
                    취소
                  </Button>
                  <Button variant="contained" color="primary" onClick={handleSubmit} disabled={loading}>
                    답변 완료
                  </Button>
                </Box>
              </>
            )}

            {/* 상태가 '답변완료'일 경우 버튼 렌더링 */}
            {qna.status === '답변완료' && (
              <>
                <Typography variant="h6" sx={{ mt: 2 }}>
                  답변 완료 날짜: {qna.updated_date ? new Date(qna.updated_date).toLocaleString() : '날짜 없음'}
                </Typography>
                <Box display="flex" justifyContent="flex-end" mt={3}>
                  <Button variant="contained" color="primary" onClick={handleEdit} disabled={loading} sx={{ mr: 1 }}>
                    수정
                  </Button>
                  <Button variant="outlined" onClick={handleCancel} disabled={loading} sx={{ mr: 1 }}>
                    취소
                  </Button>
                  <Button variant="contained" color="error" onClick={handleDelete} disabled={loading}>
                    삭제
                  </Button>
                </Box>
              </>
            )}
          </Box>
        </CardContent>
      </Card>

      {/* 로딩 스피너 */}
      {loading && (
        <Box
          position="fixed"
          top={0}
          left={0}
          right={0}
          bottom={0}
          display="flex"
          justifyContent="center"
          alignItems="center"
          bgcolor="rgba(255, 255, 255, 0.7)"
          zIndex={999}
        >
          <CircularProgress size={60} />
        </Box>
      )}
    </Box>
  );
}


export default QnaReadComponent;
