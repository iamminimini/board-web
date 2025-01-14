import React, { ChangeEvent, useEffect, useState } from 'react';
import Modal from '@atlaskit/modal-dialog';
import Button from '@atlaskit/button/new';
import TextField from '@atlaskit/textfield';
import styled from 'styled-components';
import Form, { ErrorMessage, Field, FormFooter } from '@atlaskit/form';
import { useGetUser, usePutUser } from '@react-query/queries/userQueries';

import { ButtonGroup } from '@atlaskit/button';
import { queryClient } from '@react-query/queryClient';
import { QUERY_KEYS } from '@react-query/queryKeys';
import { emailRegex } from '@utils/validators';

interface EditUserModalProps {
  userId: number;
  onClose: () => void;
}

const EditUserModal = ({ userId, onClose }: EditUserModalProps) => {
  const { userData } = useGetUser(userId);
  const [name, setName] = useState<string>('');
  const [email, setEmail] = useState<string>('');
  const { mutatePutUser } = usePutUser();

  useEffect(() => {
    if (!userData) return;
    const { name, email } = userData;
    setName(name);
    setEmail(email);
  }, [userData]);

  const handleSubmit = (formData: any) => {
    const data = { ...userData, ...formData };
    const { id, ...updatedUser } = data;
    // 현재 우회 해도 cors 에러 발생 확인 필요
    mutatePutUser(
      { id, updatedUser },
      {
        onSuccess: () => {
          // 성공 시 쿼리 리패치
          queryClient.invalidateQueries([QUERY_KEYS.GET_USERS]);
          onClose();
        },
        onError: (error) => {
          console.error('error', error);
        },
      }
    );
  };

  return (
    <Modal onClose={onClose} label='사용자 수정'>
      <ModalContents>
        <Form onSubmit={handleSubmit}>
          {({ formProps, submitting, setFieldValue }) => (
            <form {...formProps}>
              <Field
                name='name'
                label='Name'
                defaultValue={name}
                isRequired
                validate={(value) => {
                  if (!value) return 'Name is required';
                  return undefined;
                }}
              >
                {({ fieldProps, error }) => (
                  <>
                    <TextField
                      {...fieldProps}
                      value={name}
                      onChange={(e: ChangeEvent<HTMLInputElement>) => {
                        setName(e.target.value);
                        setFieldValue('name', e.target.value);
                      }}
                    />
                    {error && <ErrorMessage>{error}</ErrorMessage>}
                  </>
                )}
              </Field>

              <Field
                name='email'
                label='Email'
                defaultValue={email}
                isRequired
                validate={(value) => {
                  if (!value) return 'Email is required';
                  if (!emailRegex.test(value)) return 'Invalid email format';
                  return undefined;
                }}
              >
                {({ fieldProps, error }) => (
                  <>
                    <TextField
                      {...fieldProps}
                      type='email'
                      value={email}
                      onChange={(e: ChangeEvent<HTMLInputElement>) => {
                        setEmail(e.target.value);
                        setFieldValue('email', e.target.value); // Field 값 업데이트
                      }}
                    />
                    {error && <ErrorMessage>{error}</ErrorMessage>}
                  </>
                )}
              </Field>

              <FormFooter>
                <ButtonGroup>
                  <Button
                    type='submit'
                    appearance='primary'
                    isDisabled={submitting}
                  >
                    수정하기
                  </Button>
                  <Button type='button' onClick={onClose} appearance='subtle'>
                    취소
                  </Button>
                </ButtonGroup>
              </FormFooter>
            </form>
          )}
        </Form>
      </ModalContents>
    </Modal>
  );
};

export default EditUserModal;

const ModalContents = styled.div`
  padding: 20px;
`;
