import React from "react";
import "98.css";

const container = {
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  flexDirection: "column",
  height: "100vh",
};

const item = {
  margin: "10px",
  fontSize: "16px",
};

const btnContainer = {
  margin: "20px",
  display: "grid",
  gridTemplateColumns: "1fr 1fr",
  gridGap: "10px",
};

function App() {
  const [debtors, setDebtors] = React.useState([]);
  const [payments, setPayments] = React.useState([{ name: "", charge: 0 }]);
  const [dialogIsVisible, setDialog] = React.useState(false);

  const splitPayments = (payments) => {
    const totalSum = payments.reduce((acc, next) => +next.charge + acc, 0);
    const mean = totalSum / payments.length;

    const sortedPayments = payments.sort(
      (personA, personB) => +personA.charge - +personB.charge
    );
    const sortedValuesPaid = sortedPayments.map(
      (person) => +person.charge - mean
    );

    let i = 0;
    let j = sortedPayments.length - 1;
    let debt;
    const tmpDebtors = [];

    while (i < j) {
      debt = Math.min(-sortedValuesPaid[i], sortedValuesPaid[j]);
      sortedValuesPaid[i] += debt;
      sortedValuesPaid[j] -= debt;
      tmpDebtors.push(
        `${sortedPayments[i].name} owes ${
          sortedPayments[j].name
        } ${debt.toFixed(2)}`
      );

      if (sortedValuesPaid[i] === 0) {
        i++;
      }

      if (sortedValuesPaid[j] === 0) {
        j--;
      }
    }
    setDebtors(tmpDebtors);
    setDialog(true);
  };

  const renderNew = (payment, idx) => {
    return (
      <div className='field-row' key={idx}>
        <input
          type='text'
          placeholder='Who'
          value={payment.name}
          onChange={(e) => {
            setPayments([
              ...payments.slice(0, idx),
              { name: e.target.value, charge: payments[idx].charge },
              ...payments.slice(idx + 1),
            ]);
          }}
        />
        <input
          type='text'
          placeholder='How much'
          value={payment.charge}
          onChange={(e) => {
            setPayments([
              ...payments.slice(0, idx),
              { name: payments[idx].name, charge: e.target.value },
              ...payments.slice(idx + 1),
            ]);
          }}
        />
      </div>
    );
  };

  const isNotValid =
    payments.some((payment) => isNaN(+payment.charge) || payment.name == "") ||
    payments.length < 2;

  const renderDialog = () =>
    debtors.length > 0 && (
      <div className='window'>
        <div className='title-bar'>
          <div className='title-bar-text'>Who owes money</div>
          <div className='title-bar-controls'>
            <button
              aria-label='Close'
              onClick={() => {
                setDialog(false);
              }}
            ></button>
          </div>
        </div>
        <div className='window-body'>
          {debtors.map((debtor, idx) => (
            <div style={item} key={idx}>
              {debtor}
            </div>
          ))}
        </div>
      </div>
    );
  return (
    <div className='window' style={container}>
      {dialogIsVisible ? (
        renderDialog()
      ) : (
        <>
          {payments.map((payment, idx) => renderNew(payment, idx))}
          <div style={btnContainer}>
            <button
              onClick={() =>
                setPayments([...payments, { name: "", charge: 0 }])
              }
            >
              Add
            </button>
            <button onClick={() => setPayments(payments.slice(0, -1))}>
              Remove
            </button>
            <button onClick={() => setPayments([{ name: "", charge: 0 }])}>
              Clear
            </button>
            <button
              disabled={isNotValid}
              onClick={() => splitPayments(payments)}
            >
              Split money
            </button>
          </div>
        </>
      )}
    </div>
  );
}

export default App;
