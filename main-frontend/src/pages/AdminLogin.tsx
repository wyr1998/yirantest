import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { authService } from '../services/authService';

const LoginContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
`;

const LoginCard = styled.div`
  background: white;
  padding: 40px;
  border-radius: 10px;
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.1);
  width: 100%;
  max-width: 400px;
`;

const Title = styled.h1`
  text-align: center;
  color: #333;
  margin-bottom: 30px;
  font-size: 2em;
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 20px;
`;

const InputGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
`;

const Label = styled.label`
  font-weight: 500;
  color: #555;
`;

const Input = styled.input`
  padding: 12px;
  border: 2px solid #e0e0e0;
  border-radius: 5px;
  font-size: 16px;
  transition: border-color 0.3s;
  
  &:focus {
    outline: none;
    border-color: #2196f3;
  }
`;

const LoginButton = styled.button`
  background: #2196f3;
  color: white;
  padding: 12px;
  border: none;
  border-radius: 5px;
  font-size: 16px;
  font-weight: 500;
  cursor: pointer;
  transition: background-color 0.3s;
  
  &:hover {
    background: #1976d2;
  }
  
  &:disabled {
    background: #ccc;
    cursor: not-allowed;
  }
`;

const ErrorMessage = styled.div`
  color: #d32f2f;
  text-align: center;
  font-size: 14px;
`;

const SuccessMessage = styled.div`
  color: #2e7d32;
  text-align: center;
  font-size: 14px;
`;

const AdminLogin: React.FC = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setLoading(true);

    try {
      await authService.login({ username, password });
      setSuccess('登录成功！正在跳转...');
      setTimeout(() => {
        navigate('/dna-repair/admin');
      }, 1000);
    } catch (error: any) {
      setError(error.message || '登录失败，请重试');
    } finally {
      setLoading(false);
    }
  };

  return (
    <LoginContainer>
      <LoginCard>
        <Title>管理员登录</Title>
        <Form onSubmit={handleSubmit}>
          <InputGroup>
            <Label>用户名</Label>
            <Input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
              disabled={loading}
            />
          </InputGroup>
          <InputGroup>
            <Label>密码</Label>
            <Input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              disabled={loading}
            />
          </InputGroup>
          {error && <ErrorMessage>{error}</ErrorMessage>}
          {success && <SuccessMessage>{success}</SuccessMessage>}
          <LoginButton type="submit" disabled={loading}>
            {loading ? '登录中...' : '登录'}
          </LoginButton>
        </Form>
      </LoginCard>
    </LoginContainer>
  );
};

export default AdminLogin; 