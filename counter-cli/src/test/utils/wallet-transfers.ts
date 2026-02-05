import { CombinedTokenTransfer } from '@midnight-ntwrk/wallet-sdk-facade';
import * as api from '../../api';
import * as ledger from '@midnight-ntwrk/ledger-v7';
import { tokenValue } from './utils';
import { MidnightBech32m, UnshieldedAddress } from '@midnight-ntwrk/wallet-sdk-address-format';
import { getNetworkId } from '@midnight-ntwrk/midnight-js-network-id';

//allows to transfer unshielded tokens
//TODO: correct error with address
export async function sendUnshieldedToken(wallet: api.WalletContext, address: string, amount: bigint): Promise<string> {

  const tokenTransfer: CombinedTokenTransfer[] = [
    {
      type: 'unshielded',
      outputs: [
        {
          type: ledger.unshieldedToken().raw,
          amount: tokenValue(amount),
          receiverAddress: address,
        },
      ],
    },
  ];

  const recipe = await wallet.wallet.transferTransaction(
    tokenTransfer,
    { shieldedSecretKeys: wallet.shieldedSecretKeys, dustSecretKey: wallet.dustSecretKey },
    { ttl: new Date(Date.now() + 300 * 60 * 1000) },
  );

  const signedRecipe = await wallet.wallet.signRecipe(recipe, (payload) =>
    wallet.unshieldedKeystore.signData(payload),
  );

  const finalizedTx = await wallet.wallet.finalizeRecipe(signedRecipe);
  const submittedTxHash = await wallet.wallet.submitTransaction(finalizedTx);

  return submittedTxHash;
}

//allows to transfer arbitrary unshielded tokens
export async function sendArbitraryUnshieldedToken(wallet: api.WalletContext, address: string, amount: bigint): Promise<string> {

  //address Hex format
  const addressBech32m = MidnightBech32m.parse(address);
  const addressHex = UnshieldedAddress.codec.decode(getNetworkId(), addressBech32m);

  const outputs = [
    {
      type: ledger.unshieldedToken().raw,
      value: tokenValue(amount),
      owner: addressHex.hexString,
    },
  ];

  const intent = ledger.Intent.new(new Date(Date.now() + 30 * 60 * 1000));
  intent.guaranteedUnshieldedOffer = ledger.UnshieldedOffer.new([], outputs, []);

  const arbitraryTx = ledger.Transaction.fromParts(getNetworkId(), undefined, undefined, intent);

  const recipe = await wallet.wallet.balanceUnprovenTransaction(
    arbitraryTx,
    { shieldedSecretKeys: wallet.shieldedSecretKeys, dustSecretKey: wallet.dustSecretKey },
    { ttl: new Date(Date.now() + 30 * 60 * 1000) },
  );

  const signedRecipe = await wallet.wallet.signRecipe(recipe, (payload) =>
    wallet.unshieldedKeystore.signData(payload),
  );

  const finalizedTx = await wallet.wallet.finalizeRecipe(signedRecipe);
  const submittedTxHash = await wallet.wallet.submitTransaction(finalizedTx);

  return submittedTxHash;
}
