/* eslint-disable @typescript-eslint/ban-ts-comment */
import { useState } from "react";
import { useAccount, useSignMessage, useSignTypedData } from "wagmi";
import axios from "axios";
import { splitSignature } from "ethers/lib/utils";
import { toast } from "sonner";
import { useAuth } from "@/context/AuthContext";
import { config } from "@/config/env";
import { useApplicationData } from "@/context/ApplicationDataContext";

const BASE_API_URL = config.apiUrl;

export const useDeposit = () => {
  const [trxState, setTrxState] = useState<
    "idle" | "confirming" | "pending" | "confirmed" | "failed"
  >("idle");

  const { isConnected, address: account } = useAccount();
  const { isAuthenticated, login, loading, updateUserState } = useAuth();
  const { updatePresaleState } = useApplicationData();

  const { signTypedData } = useSignTypedData();

  const getSignatureValues = (signature: string) => {
    const { r, s, v } = splitSignature(signature);
    return { r, s, v };
  };

  const depositUSDC = async (
    presaleId: string,
    amount: string,
    adminWallet: string
  ) => {
    if (!isAuthenticated) {
      toast.error("Please connect your wallet");
      return;
    }

    try {
      const recepientAddress = adminWallet;
      const currentTimeStampInMs = Date.now();

      const info = {
        domain: {
          name: "HyperliquidSignTransaction",
          chainId: 421614,
          verifyingContract: "0x0000000000000000000000000000000000000000",
          version: "1",
        },
        types: {
          "HyperliquidTransaction:UsdSend": [
            {
              name: "hyperliquidChain",
              type: "string",
            },
            {
              name: "destination",
              type: "string",
            },
            {
              name: "amount",
              type: "string",
            },
            {
              name: "time",
              type: "uint64",
            },
          ],
          EIP712Domain: [
            {
              name: "name",
              type: "string",
            },
            {
              name: "version",
              type: "string",
            },
            {
              name: "chainId",
              type: "uint256",
            },
            {
              name: "verifyingContract",
              type: "address",
            },
          ],
        },
        primaryType: "HyperliquidTransaction:UsdSend",
        message: {
          amount: amount,
          destination: recepientAddress,
          hyperliquidChain: "Mainnet",
          signatureChainId: "0x66eee",
          time: currentTimeStampInMs,
          type: "usdSend",
        },
      };

      setTrxState("confirming");

      signTypedData(
        {
          // @ts-expect-error
          domain: info.domain,
          account: account,
          message: info.message,
          primaryType: "HyperliquidTransaction:UsdSend",
          types: info.types,
        },
        {
          async onSuccess(data) {
            setTrxState("pending");
            const signature = data;

            const headers = {
              "Content-Type": "application/json",
            };
            const payload = {
              action: info.message,
              nonce: currentTimeStampInMs,
              signature: getSignatureValues(signature),
              walletAddress: account,
              presaleId: presaleId,
            };

            try {
              const res = await axios.post(
                `${BASE_API_URL}/api/presales/${presaleId}/deposit`,
                payload,
                {
                  headers,
                }
              );

              const updatedUser = res.data?.user;
              const updatedPresale = res.data?.presale;
              updateUserState(updatedUser);
              updatePresaleState(updatedPresale);

              console.log("deposit res ", { res });
            } catch (error) {
              console.error("error depositing", error);
              setTrxState("failed");
              toast.error(`${error?.response?.data?.error}`);
              return;
            }

            setTrxState("confirmed");

            toast.success("Deposit successful");
          },
          onError(error) {
            console.error(error);
            setTrxState("failed");
            toast.error("Deposit failed");
          },
        }
      );
    } catch (error) {
      console.log({ error });
      setTrxState("failed");
      toast.error("Deposit failed");
    }
  };

  return { trxState, depositUSDC };
};
