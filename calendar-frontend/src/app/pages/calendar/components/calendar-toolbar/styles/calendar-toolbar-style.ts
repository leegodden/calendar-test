import { css } from '@emotion/react';

export const ToolbarStyle = css`
  width: 100%;
  text-align: center;
  padding: 8px 0;
  margin-bottom: 8px;
  border-bottom: 1px solid;
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 10px;

  button {
    color: #373a3c;
    //display: inline-block;
    margin: 0;
    text-align: center;
    vertical-align: middle;
    background: none;
    border: 1px solid #ccc;
    padding: 0.375rem 1rem;
    border-radius: 4px;
    line-height: normal;
    white-space: nowrap;

    &:hover {
      color: #373a3c;
      background-color: rgb(229.5, 229.5, 229.5);
      border-color: rgb(173.4, 173.4, 173.4);
      cursor: pointer;
    }

    &:active {
      box-shadow: inset 0 3px 5px rgba(0, 0, 0, 0.125);
      background-color: rgb(229.5, 229.5, 229.5);
      border-color: rgb(173.4, 173.4, 173.4);
    }

    &:disabled {
      background-color: #ccc;
      color: #fff;
      pointer-events: none;
    }
  }
`;
