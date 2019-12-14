import { CommandHandler, RedirectHandler } from '../Handler';

const ibank = new CommandHandler();

const banks = {
  cimb: ['CIMB Clicks Singapore', 'https://www.cimbclicks.com.sg/clicks/'],
  citi: [
    'Citibank Online Singapore',
    'https://www.citibank.com.sg/SGGCB/JSO/signon/DisplayUsernameSignon.do',
  ],
  dbs: ['DBS Singapore digibank', 'https://internet-banking.dbs.com.sg/IB/Welcome'],
  dbsideal: ['DBS IDEAL', 'https://ideal.dbs.com/'],
  hsbc: ['HSBC Singapore Online Banking', 'https://www.hsbc.com.sg/security/'],
  maybank: [
    'Maybank Singapore Online Banking',
    'https://sslsecure.maybank.com.sg/cgi-bin/mbs/scripts/mbb_login.jsp',
  ],
  ocbc: ['OCBC Online Banking', 'https://internet.ocbc.com/internet-banking/'],
  rhb: ['RHB Singapore Internet Banking', 'https://logon.rhbbank.com.sg/'],
  sc: ['Standard Chartered Singapore online banking', 'https://ibank.standardchartered.com.sg/'],
  uob: ['UOB Personal Internet Banking', 'https://pib.uob.com.sg/'],
};

Object.entries(banks).forEach(([command, [product, targetUrl]]) =>
  ibank.addHandler(command, new RedirectHandler(`navigates to ${product}`, targetUrl)),
);

export default ibank;
