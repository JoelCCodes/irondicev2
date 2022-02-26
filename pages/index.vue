<template>

  <div class="flex flex-col w-full">
    <div class = "flex flex-row">
    <div :show="true" text="6X Gains" class= "grid-cols-4 h-full w-1/3">
    </div>
    <div :show="false" text="Take your chance" icon="dice" class="grid-cols-4 h-full w-1/3">
      <b-field label="Predicted Dice Outcome">
        <b-numberinput v-model="diceOutcome" placeholder="1-6" :min="1" :max="6"></b-numberinput>
      </b-field>
      <b-field label="Bet Amount">
        <b-numberinput v-model="betAmount" placeholder="2-500" :min="2" :max="500"></b-numberinput>
      </b-field>
      <center>
        <b-button @click="placeBet"> Roll </b-button>
      </center>
    </div>
    <div class="grid-cols-4 h-full w-1/3" text="Stats">
      <h4 class="subtitle">
        Last Number Rolled: {{ rolledValue }}
        <br />
        Total Bets: {{ totalBets }}
        <br />
        Total Rewards: {{ totalRewards }}
        <br />
        Bet Amount {{ betAmount }}
        <br />
        Dice Outcome: {{ diceOutcome }}
        <br />
      </h4>
    
    </div>
    </div>
    <b-table v-if="battleData" class="" :data="battleData" :columns="battleColumns"/></b-table>
  </div>

</template>

<script>
import { mapState } from 'vuex'
export default {
  name: 'App',
  data() {
    return {
      rolledValue: 1,
      totalBets: 0,
      totalRewards: 0,
      betAmount: 2,
      diceOutcome: 1,
      battleData:[],
      battleColumns: [
           {
          field: 'houseRoll',
          label: 'House Roll',
          numeric: true,
        },
        {
          field: 'playerNumber',
          label: 'Player Number',
          numeric: true,
        },
        {
            field: 'winnings',
            label:"winnings",
            numeric: true
        }
      ]
    }
  },
  computed: {
    ...mapState(['selectedAccount', 'balance']),
  },
  async mounted() {

    console.log(this.$web3)
    // await this.load()
    // try {
    //     const latestSubMax = (await this.$web3.eth.getBlockNumber()) - 3000
    //     await this.$contracts.IronDice.events
    //       .DiceRolled({
    //         fromBlock: latestSubMax,
    //         filter: {
    //           owner: this.selectedAccount,
    //         },
    //       })
    //       .on('data', function (event) {
    //         this.battleData = events.map((a) => a.returnValues)
    //         console.log(this.battleData, "Game Outcome")
    //         console.log(event) // same results as the optional callback above
    //       })
    //     this.load()
        
    // } catch (error) {
    //     console.log(error)
    // }
  },
  methods: {
    // async load() {
    //   this.rolledValue = await this.$contracts.IronDice.methods.lastDiceRoll().call()
    //   this.totalBets = await this.$contracts.IronDice.methods.totalBets().call()
    //   this.totalRewards = (await this.$contracts.IronDice.methods.totalRewards().call()) / 10 ** 18
    //   this.getSettledBets()
    // },
    // async placeBet() {
    //   // await this.approval()
    //   try {
    //     let betAmountCTAG = this.$web3.utils.toWei(String(this.betAmount))
    //     console.log(betAmountCTAG)
    //     let res = await this.$contracts.IronDice.methods.placeBet(betAmountCTAG, this.diceOutcome).send({
    //       from: this.selectedAccount,
    //     })
    //     console.log(res)
    //   } catch (error) {
    //     console.log(error)
    //   } finally {
    //     this.load()
    //   }
    // },
    // async approval() {
    //   await this.$contracts.TagToken.methods.approve(this.$contracts.IronDice._address, String(100 * 10 ** 18)).send({
    //     from: this.selectedAccount,
    //   })
    // },
    // async getSettledBets() {
    //   try {
    //     const latestSubMax = (await this.$web3.eth.getBlockNumber()) - 3000
    //     const events = await this.$contracts.IronDice.getPastEvents('DiceRolled', {
    //       filter: { owner: this.selectedAccount },  
    //       fromBlock: latestSubMax,
    //     })
    //     this.battleData = events.map((a) => a.returnValues)
    //     console.log(events)
    //   } catch (e) {
    //     console.log(e)
    //   }
    // },
  },
}
</script>