"use client";
import React, { use, useEffect, useState } from "react";
import { I18nextProvider } from "react-i18next";
import i18n from "../../../i18n";
import useLanguage from "../../hooks/useLanguage";
import Header from "../../components/Header";
import Footer from "../../components/Footer";
import StakingSection from "../../components/Staking/StakingSection";
import Referral from "../../components/Staking/Referral";
import Leaderboard from "../../components/Staking/Leaderboard";
import { useTranslation } from "react-i18next";

import stakingAbi from "../../components/contractABI/stakingAbi";
import tokenAbi from "../../components/contractABI/tokenAbi";
import presaleAbi from "../../components/contractABI/presaleAbi";
import { useAppKit } from "@reown/appkit/react";
import { useAccount, useReadContract, useWriteContract } from "wagmi";
import { ethers } from "ethers";
import Web3 from "web3"


// setup blockchain here 
const Provider = new Web3.providers.HttpProvider("https://rpc.ankr.com/eth");
const web3 = new Web3(Provider);
const Staking = () => {
  useLanguage();
  const { t } = useTranslation();

  // wallet open 
  const {isConnected, address} = useAccount()
  const stakeAddress = "0x2bf950f5789c4859fcf89c9a84bbfc30c3e244c9";
  const tokenAddress = "0x888632bb147ba407d85f1881a817c0481ff8dcda";
  const presaleAddress = "0x462eed0076dc1b2fe9deea0857df6d1953fe7d46"
  const [stackableTokenBalance, setStackableTokenBalance] = useState(0)
  const [totalReward, setTotalReward] = useState(0);
  const [referralEarnings, setReferralEarnings] = useState(0)
    // showing how much user who connected will claim data
  // const { data: totalAmountInfo } = useReadContract({
  //   abi: presaleAbi.abi,
  //   address: presaleAddress,
  //   functionName: 'userClaimData',
  //   args: [address],
  // })
  // show user who connected all token in acc
  const { data: balanceTokenData } = useReadContract({
    abi: tokenAbi.abi,
    address: tokenAddress,
    functionName: 'balanceOf',
    args: [address],
  })

  const { data: getTotalReferralEarnInfo } = useReadContract({
    abi: presaleAbi.abi,
    address: presaleAddress,
    functionName: 'getTotalReferralEarnings',
    args:[address],
  })

  const formatNumberWithCommas = (number) => {
    return number.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  };

  //

 // for total reward user will get

 // Fetch all user stakes
 const { data: userStakes } = useReadContract({
   abi: stakingAbi.abi,
   address: stakeAddress,
   functionName: "getUserStakes",
   args: [address],
 });
  // use use-effect for isConnected and more things for prevent it from running multiple times(infinite loop)
  useEffect(() => {
    if (isConnected) {

      if(getTotalReferralEarnInfo){
        console.log(getTotalReferralEarnInfo.toString())
        setReferralEarnings(web3.utils.fromWei(getTotalReferralEarnInfo.toString(), "ether"));
      }
        // all rewards user will get from staking
        if(userStakes){
          const total = userStakes.reduce((acc, stake) => {
            const amount = BigInt(stake.amount.toString()); // Convert to BigInt if it's not
            const rewardRate = BigInt(stake.rewardRate.toString()); // Convert rewardRate to BigInt if it's not
            const reward = (amount * rewardRate) / BigInt(100); // Calculate reward using BigInt
            return acc + reward;
          }, BigInt(0)); 
          setTotalReward(Number(web3.utils.fromWei(total.toString(), "ether")));
        }
      if (balanceTokenData) {
        console.log(balanceTokenData, "balanceTokenData")
        const stackableBalance = web3.utils.fromWei(balanceTokenData.toString(), "ether");
        setStackableTokenBalance(stackableBalance);
      }
    }
  }, [isConnected, address, balanceTokenData, userStakes, getTotalReferralEarnInfo],)


  return (
    <I18nextProvider i18n={i18n}>
      <Header />
      <div className="pt-[130px] lg:pt-[140px] pb-[167px] px-4 sm:px-[25px]">
        <div
          className="w-full max-w-[1160px] mx-auto rounded-[20px] lg:py-7 p-[15px] lg:px-[20px] bg-[#10002080] border border-[#8616DF]"
          style={{ backdropFilter: "blur(14px)" }}
        >
          {/* Total $VRN Balance & Staking Reward & Your Referral Earnings */}
          <div className="w-full flex items-center gap-[20px] justify-between lg:flex-row flex-col">
            <div className="w-full relative px-[15px] sm:px-5 py-[12px] lg:py-[12px] flex lg:flex-col flex-row lg:items-start items-center justify-between rounded-[10px] lg:rounded-[12px] shadow-custom">
              <h3 className="text-white text-[18px] leading-[24px] font-normal">
                {t("staking.totalVRNBalance")}
              </h3>
              <h2 className="text-white text-[24px] leading-[38.4px] font-normal">
                {stackableTokenBalance}
              </h2>
            </div>
            <div className="w-full relative px-[15px] sm:px-5 py-[12px] lg:py-[12px] flex lg:flex-col flex-row lg:items-start items-center justify-between rounded-[10px] lg:rounded-[12px] shadow-custom">
              <h3 className="text-white text-[18px] leading-[24px] font-normal">
                {t("staking.stakingReward")}
              </h3>
              <h2 className="text-white text-[24px] leading-[38.4px] font-normal">
              {totalReward > 0
                  ? `${formatNumberWithCommas(totalReward.toFixed(2))} VRN`
                  : "0.00 VRN"}
                
              </h2>
            </div>
            <div className="w-full relative px-[15px] sm:px-5 py-[12px] lg:py-[12px] flex lg:flex-col flex-row lg:items-start items-center justify-between rounded-[10px] lg:rounded-[12px] shadow-custom">
              <h3 className="text-white text-[18px] leading-[24px] font-normal">
                {t("staking.referralEarnings")}
              </h3>
              <h2 className="text-white text-[24px] leading-[38.4px] font-normal">
              {referralEarnings > 0
                  ? `${formatNumberWithCommas(referralEarnings.toFixed(2))} VRN`
                  : "0.00 VRN"}
              </h2>
            </div>
          </div>
          <StakingSection />
          {/* Referral & Leaderboard */}
          <div className="grid grid-rows-1 lg:grid-cols-2 gap-[20px]">
         {/*   <Referral />
            <Leaderboard />
            */ }
          </div>
        </div>
      </div>
      <Footer />
    </I18nextProvider>
  );
};

export default Staking;
