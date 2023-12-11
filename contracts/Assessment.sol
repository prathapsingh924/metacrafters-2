// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.9;

contract Assessment {
    address payable public owner;
    uint256 public balance;
    uint256 public totalLoans;

    event Deposit(uint256 amount);
    event Withdraw(uint256 amount);
    event TakeLoan(uint256 amount, uint256 interestRate, uint256 duration);
    event RepayLoan(uint256 amount);

    struct Loan {
        uint256 amount;
        uint256 interestRate; // Annual interest rate in percentage
        uint256 duration; // Loan duration in months
        uint256 startTime;
    }

    mapping(address => Loan) public loans;

    constructor(uint256 initBalance) payable {
        owner = payable(msg.sender);
        balance = initBalance;
    }

    function getBalance() public view returns (uint256) {
        return balance;
    }

    function deposit(uint256 _amount) public payable {
        uint256 _previousBalance = balance;

        require(msg.sender == owner, "You are not the owner of this account");

        balance += _amount;

        assert(balance == _previousBalance + _amount);

        emit Deposit(_amount);
    }

    error InsufficientBalance(uint256 balance, uint256 withdrawAmount);

    function withdraw(uint256 _withdrawAmount) public {
        require(msg.sender == owner, "You are not the owner of this account");
        uint256 _previousBalance = balance;
        if (balance < _withdrawAmount) {
            revert InsufficientBalance({
                balance: balance,
                withdrawAmount: _withdrawAmount
            });
        }

        balance -= _withdrawAmount;

        assert(balance == (_previousBalance - _withdrawAmount));

        emit Withdraw(_withdrawAmount);
    }

    function takeLoan(uint256 _amount, uint256 _interestRate, uint256 _duration) public {
        require(msg.sender == owner, "You are not the owner of this account");
        require(loans[msg.sender].amount == 0, "You already have an active loan");

        uint256 interestAmount = (_amount * _interestRate * _duration) / (100 * 12);

        loans[msg.sender] = Loan({
            amount: _amount,
            interestRate: _interestRate,
            duration: _duration,
            startTime: block.timestamp
        });

        balance += _amount - interestAmount;
        totalLoans += _amount;

        emit TakeLoan(_amount, _interestRate, _duration);
    }

    function repayLoan(uint256 _amount) public {
        require(msg.sender == owner, "You are not the owner of this account");
        require(loans[msg.sender].amount > 0, "No active loan to repay");

        Loan storage loan = loans[msg.sender];

        // Calculate interest accrued
        uint256 elapsedTime = (block.timestamp - loan.startTime) / (30 days);
        uint256 interestAccrued = (loan.amount * loan.interestRate * elapsedTime) / (100 * 12);

        uint256 totalRepayment = loan.amount + interestAccrued;

        require(_amount <= totalRepayment, "Invalid repayment amount");

        // Update balance and total loans
        balance -= _amount;
        totalLoans -= loan.amount;

        // Clear the loan details
        delete loans[msg.sender];

        emit RepayLoan(_amount);
    }
}
