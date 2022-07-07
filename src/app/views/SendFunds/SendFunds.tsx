import React, { useEffect, useMemo } from "react";
import Input from "@app/components/Input";
import { Modal } from "@app/components/Modals/Modal";
import { ButtonContainer } from "@app/components/ButtonsContainer/ButtonContainer";
import { CloseBtn } from "@app/components/CloseBtn/CloseBtn";
import Button from "@app/components/Button";
import SendIcon from '@app/assets/icons/send.svg';
import BeamIcon from '@app/assets/icons/beam.svg';
import CheckedIcon from '@app/assets/icons/checked.svg';
import { useCurrentTransactionState } from "@app/library/transaction-react/useCurrentTransactionState";
import { IsTransactionPending } from "@app/library/transaction-react/IsTransactionStatus";
import { useSelector } from "react-redux";
import { selectRate } from "@app/store/BansStore/selectors";
import { Decimal } from "@app/library/base/Decimal";
import { SendFundsAction } from "./SendFundsAction";
import { DomainPresenterType, getDomainPresentedData } from "@app/library/bans/DomainPresenter";
import { useModalContext } from "@app/contexts/Modal/ModalContext";
import { useFetchDomainAndConvert } from "@app/hooks/useFetchDomainAndConvert";
import { useSearchValidator } from "@app/hooks/useSearchValidator";
import { useConvertToDomainPresenter } from "@app/hooks/useConvertToDomainPresenter";
import { selectPublicKey, selectSystemState } from "@app/store/SharedStore/selectors";
import { LoadingOverlay } from "@app/components/LoadingOverlay";

interface SendFundsProps {
  isShown: boolean;
  closeModal?: (...args) => void;
}

const initialValues = {
  domain: '',
  amount: 0
}

export const SendFunds: React.FC<SendFundsProps> = ({ isShown, closeModal }) => {

  if (!isShown) return <></>;

  const { close }: { close: any } = useModalContext();

  closeModal = closeModal ?? close;

  const TRANSACTION_ID = "SEND_FUNDS";

  const transactionState = useCurrentTransactionState(TRANSACTION_ID);
  const isTransactionPending = IsTransactionPending({ transactionIdPrefix: TRANSACTION_ID });

  useEffect(() => {
    if (transactionState.id === TRANSACTION_ID && transactionState.type === "completed") {

      closeModal(null);

      return () => {
        //store.dispatch()
      }
    }

  }, [transactionState]);

  const [values, setValues] = React.useState(initialValues);
  const [domain, setDomain] = React.useState<DomainPresenterType>(null);
  const [isButtonDisabled, setIsButtonDisabled] = React.useState(true);


  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;

    setIsButtonDisabled(domain ? false : true);

    setValues({
      ...values,
      [name]: value,
    });
  }

  const beamPrice = useSelector(selectRate());

  useFetchDomainAndConvert(values.domain).then(domain => setDomain(
    domain
  ));
  
  //const convert = useConvertToDomainPresenter();

  /* useEffect(() => {
    searchValidator && fetchDomain(values.domain).then(domain => setDomain(
      domain
    )
    );
  }, [values.domain]) */


  return (
    <Modal isShown={isShown} header="Send funds to the BANS">
      <>
      {isTransactionPending && <LoadingOverlay />}
        <Input
          variant='modalInput'
          pallete='purple'
          label='Domain*'
          name='domain'
          onChange={handleChange}
          value={values.domain}
        >
          <CheckedIcon />
        </Input>
        <Input
          variant='modalInput'
          pallete='purple'
          label='Amount*'
          name='amount'
          onChange={handleChange}
          value={values.amount}
          info={`${beamPrice.mul(Decimal.from(!!values.amount ? values.amount : 0).toString()).prettify(2)} USD`}
        >
          <BeamIcon />
        </Input>

        <ButtonContainer>
          <CloseBtn toggle={closeModal} text="cancel" />
          <SendFundsAction
            transactionId={TRANSACTION_ID}
            change={"sendFunds"}
            domain={domain}
            amount={values.amount}
            disabled={isButtonDisabled}
          >
            <SendIcon />
            Send
          </SendFundsAction>
        </ButtonContainer>
      </>
    </Modal>
  )
}