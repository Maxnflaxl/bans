import React, { useEffect, useState } from "react";
import { Box, Container, Flex, Text } from "theme-ui";
import { Modal } from "@app/components/Modals/Modal";
import { Select } from '@app/components/Select/Select';
import Input from "@app/components/Input";
import Beam from '@app/assets/icons/beam.svg';
import { CloseBtn } from "@app/components/CloseBtn/CloseBtn";
import { DomainPresenterType } from "@app/library/bans/DomainPresenter";
import { SellBansAction } from "@app/views/Actions/SellBansAction";
import Sell from '@app/assets/icons/send.svg';
import { useCurrentTransactionState } from "@app/library/transaction-react/useCurrentTransactionState";
import { IsTransactionPending } from "@app/library/transaction-react/IsTransactionStatus";
import { Decimal } from "@app/library/base/Decimal";
import { useSelector } from "react-redux";
import { selectRate } from "@app/store/BansStore/selectors";
import { useModalContext } from "@app/contexts/Modal/ModalContext";
import { reloadAllUserInfo } from "@app/store/BansStore/actions";
import store from "index";

interface SellBansModalProps {
  isShown: boolean;
  closeModal?: (...args) => void;
}

export const SellBansModal: React.FC<SellBansModalProps> = ({ isShown, closeModal }) => {

  if (!isShown) return <></>;

  const { close, data: { domain: domain } }: { close: any, data: { domain: DomainPresenterType } } = useModalContext();

  closeModal = closeModal ?? close;

  let domains = [];
  
  const TRANSACTION_ID = "DOMAIN_SELLING";
  const transactionState = useCurrentTransactionState(TRANSACTION_ID);
  const isTransactionPending = IsTransactionPending({ transactionIdPrefix: TRANSACTION_ID });

  const [activeItem, setActiveItem] = React.useState('');
  const [amount, setAmount] = useState<number | string | null>("");
  const [selectedDomain, setSelectedDomain] = useState<DomainPresenterType>(domain);

  const domainsSelect: any = !!domains && domains.length ? domains.map((domain, i) => new Object({
    id: i,
    name: domain.name
  })) : [];

  /*   setActiveItem(
      domainsSelect.filter(domainSelect => domain.name == domainSelect.name).pop().id
    )
   */

  const handleChange = (e) => setAmount(e.target.value);

  useEffect(() => {
    if (transactionState.id === TRANSACTION_ID && transactionState.type === "completed") {

      closeModal(null);

      return () => {
        store.dispatch(reloadAllUserInfo.request());
      }
    }

  }, [transactionState]);


  const beamPrice = useSelector(selectRate());


  return (
    <Modal isShown={isShown} header="Sell Bans">
      <Container sx={{ width: 630, padding: '40px 65px' }}>
        {
          selectedDomain.isOnSale ? <Flex sx={{ mb: 20, textAlign: "center", alignContent: "center" }}>
            <Text>{`ALREADY ON SALE for ${selectedDomain.price.amount}!`}</Text>
          </Flex> : <></>
        }
        {/* <Select items={domainsSelect} setActiveItem={setActiveItem} activeItem={activeItem}> 
              <div className="selected" onClick={() => setShow(true)}>
                {activeItem ? activeItem : items[0].name}
                <ArrowDown className="arrow"/>
              </div>
            </Select>
        */}
        <Box sx={{ mt: '30px' }}>
          <Input
            variant='modalInput'
            pallete='white'
            label='Amount'
            onChange={handleChange}
            value={amount}
            type="number"
            info={`${beamPrice.mul(Decimal.from(!!amount ? amount : 0).toString()).prettify(2)} USD`}
          >
            <Beam />
          </Input>
        </Box>
        <Box sx={{ my: '30px' }}>
        </Box>
        <Flex sx={{ justifyContent: 'center' }}>
          <Box sx={{ mr: '30px' }}>
            <CloseBtn toggle={closeModal} />
          </Box>
          <SellBansAction
            transactionId={TRANSACTION_ID}
            change={"sellBans"}
            amount={+amount}
            domain={selectedDomain}
          >
            <Sell />
            <Text sx={{ ml: '9px', fontWeight: 'bold', color: '#032E49' }}>Sell</Text>
          </SellBansAction>
        </Flex>
      </Container>
    </Modal>
  )
}