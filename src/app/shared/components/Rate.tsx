import React from 'react';
import { styled } from '@linaria/react';

import { fromGroths, getSign, toUSD } from '@core/appUtils';
import { useSelector } from 'react-redux';
import { selectRate } from '@app/containers/Main/store/selectors';

interface Props {
  value: number;
  income?: boolean;
  groths?: boolean;
  className?: string;
  selectedCurrencyId?: string;
}

const Ratetyled = styled.div`
  text-align: start;
  margin-top: 6px;
  margin-left: 15px;
  font-family: 'SFProDisplay';
  font-size: 14px;
  color: rgba(255, 255, 255, 0.6);
`;

const Rate: React.FC<Props> = ({
  value, income, groths, className, selectedCurrencyId = 'beam',
}) => {
  const rate = useSelector(selectRate());
  const sign = income ? getSign(income) : '';
  const amount = groths ? fromGroths(value) : value;
  return (
    <Ratetyled className={className}>
      {sign}
      {toUSD(amount, rate ? rate[selectedCurrencyId].usd : 0)}
    </Ratetyled>
  );
};

export default Rate;