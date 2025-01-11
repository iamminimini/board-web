import React, { ChangeEvent, useState } from 'react';
import Modal from '@atlaskit/modal-dialog';
import Button from '@atlaskit/button';
import TextField from '@atlaskit/textfield';
import { User } from '../type/user'; // User 타입 임포트
import styled from 'styled-components';
import Form, { ErrorMessage, Field, FormFooter } from '@atlaskit/form';

interface EditUserModalProps {
  user: User;
  onClose: () => void;
  onSave: (updatedUser: User) => void;
}

const EditUserModal = ({ user, onClose, onSave }: EditUserModalProps) => {
  const [name, setName] = useState(user.name);
  const [age, setAge] = useState(user.age);

  const handleSubmit = (formData: any) => {
    const updatedUser = { ...user, ...formData };
    onSave(updatedUser);
    onClose();
  };

  return (
    <Modal onClose={onClose} label='사용자 수정'>
      <ModalContents>
        <p>ID: {user.id}</p>
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
                        setFieldValue('name', e.target.value); // Field 값 업데이트
                      }}
                    />
                    {error && <ErrorMessage>{error}</ErrorMessage>}
                  </>
                )}
              </Field>

              <Field
                name='age'
                label='Age'
                defaultValue={age}
                isRequired
                validate={(value) => {
                  if (!value || isNaN(Number(value)))
                    return 'Age must be a valid number';
                  return undefined;
                }}
              >
                {({ fieldProps, error }) => (
                  <>
                    <TextField
                      {...fieldProps}
                      type='number'
                      value={age.toString()}
                      onChange={(e: ChangeEvent<HTMLInputElement>) => {
                        const newAge = Number(e.target.value);
                        setAge(newAge);
                        setFieldValue('age', newAge); // Field 값 업데이트
                      }}
                    />
                    {error && <ErrorMessage>{error}</ErrorMessage>}
                  </>
                )}
              </Field>

              <FormFooter>
                <Button
                  type='submit'
                  appearance='primary'
                  //   isLoading={submitting}
                  isDisabled={submitting}
                >
                  수정하기
                </Button>
                <Button type='button' onClick={onClose} appearance='subtle'>
                  취소
                </Button>
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
