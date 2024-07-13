(fw-aim3)=
# Iteration

## The World According to Nassim Taleb
© 1996 -- Derivatives Strategy

## Derivatives Strategy: What problems do you have with financial engineering?

**Nassim Taleb:** I disagree with such an approach in financial risk management. Some folks looked at the literature and saw differential equations and said, "Gee, it's like engineering." Engineering relies on models because you can capture the relationships in the physical world very well. Models in the social sciences serve a different purpose. They make strong assumptions. Economists have known for a long time that math in their profession has a different meaning. It's just a tool, a way to express yourself.

**DS:** So real engineering could lead to a bridge that you could reliably drive cars across. But modeling in financial engineering isn't certain enough to run a portfolio...

**NT:** Exactly. In finance, you are not as confident about the parameters. The more you expand your model by adding parameters, the more you become trapped into an inextricable apparatus of relationships. It is called overfitting.

**DS:** What do you think of value at risk?

**NT:** VAR has made us replace about 2500 years of market experience with a covariance matrix that is still in its infancy. We made tabula rasa of years of market lore that was picked up from trader to trader and crammed everything into a covariance matrix. Why? So that a management consultant or an unemployed electrical engineer can understand financial market risks.

To me, VAR is charlatanism because it tries to estimate something that is not scientifically possible to estimate, namely the risks or rare events. It gives people misleading precision that could lead to the build up of positions by hedgers. It lulls people to sleep. All that because there are financial stakes involved. To know the VAR, you need the probabilities of events. To get the probabilities right, you need to forecast volatility and correlations. I spent close to a decade and a half trying to guess volatility, the volatility of volatility, and correlations, and I sometimes shiver at the mere remembrance of my past miscalculations. Wounds from correlation matrices are still sore.

**DS:** Proponents of VAR will argue that it has its shortcomings but it's better than what you had before.

**NT:** That's completely wrong. It's not better than what you had because you are relying on something with false confidence and running larger positions than you would have otherwise. You're worse off relying on misleading information than on not having any information at all. If you give a pilot an altimeter that is sometimes defective, he will crash the plane. Give him nothing and he will look out the window. Technology is only safe if it is flawless.

A lot of people reduce their anxiety when they see numbers. They want a triple digit delta or gamma, for example, not taking into account that it is foolish to be precise with deltas when you don't even know the parameters.

Before VAR, we looked at positions and understood them using what I call a non-parametric method. After VAR, all we see is numbers, numbers that depend on strong assumptions. I'd much rather see the details of the position itself rather than some numbers that are supposed to reflect its risks.

Clearing firms understood that very well. Ironically, the stock market crash coincided with the discovery of this so-called parametric system used to run the risks of option traders. In the old days, the clearing firms looked at how many calls you were short and how many you were long, and if you sold a lot of calls, they would get nervous and call you up and ask you to liquidate some of them. After they went to parametric monitoring of option positions using second rate statistical methods, the options traders started building up massive short put positions that, along with portfolio insurance, helped to accelerate the crash. Now they're coming back to square one with their non-parametric methods, particularly with the puts.

**DS:** Do you think the whole idea of trying to use statistics to model a particular distribution is fraudulent? Or is it possible to come up with something approximating the truth?

**NT:** The problem we have with statistics is that although we know something about distributions, we know very little about processes. A process is a distribution that has time in it and things change with time. People look at fat tails and say, "We can simulate distributions with fat tails." But the reason distributions have fat tails may be because these distributions don't have stable properties over time.

**DS:** VAR proponents will also admit that VAR doesn't work as well on something with an asymmetric payoff...

**NT:** Yes, but any dynamic trading strategy by a leveraged investor that has a stop loss in it has an asymmetric payoff and needs to be treated like an option. If I trade Deutsche Mark or bond futures with a stop loss, the frequency of my losses will be greater than the frequency of my profits, but the magnitude of my losses will be smaller to compensate. It will look like a payoff of an option, and that's not captured by VAR. The VAR assumes that traders are stuffed animals between two reports.

**DS:** Are you saying VAR can't be used to measure risks on a trading desk?

**NT:** The risks of common events perhaps, those that do not matter, but not the risks of rare events. Moreover, traders will find the smallest crack in the VAR models and try to find a way to take the largest position they can while showing the smallest amount of risk. Traders have incentives to go the maximum bang because of the free option they're granted.

**DS:** What free option is that?

**NT:** Most institutional traders don't pay for their losses. If you make a dollar, you get paid ten cents. If you lose one dollar, you pay zero. That obviously looks like an option payoff. So let's say your trader trades two bonds of slightly different maturities. They're very close but because they have illusory close maturities the position will not produce a big VAR number. Sometimes they are treated as the same bond. The position, however, could easily bankrupt the company because of the sheer size that was built on it. An institution just last month lost bundles because a trader built up massive positions in Bunds against German swaps as their system, otherwise sophisticated, did not differentiate between them.

**DS:** What's going to happen if everybody in the financial system starts using VAR?

**NT:** VAR players are all dynamic hedgers and need to revise their portfolios at different levels. As such, they can make very uncorrelated markets become very correlated. Those who refuse to learn from the portfolio insurance debacle do not belong to risk management.

In 1993, hedge funds were long seemingly independent markets. The first margin call in the bonds led them to liquidate their positions in the Italian, French, and German bond markets. Markets therefore became correlated. Markets that were correlated became independent. VAR is a school for sitting ducks. Find me a dynamic hedger who is a reluctant liquidator and I will front-run him to near bankruptcy.

**DS:** So one problem with VAR models is that they don't account for the fact that the market corrects for the models that trades are based on.

**NT:** Bingo. Even more: Our perception of what's going on in the real world can hurt us simply because we have to realize that we are the major players ourselves and we act according to our perceptions. In physics, it's called the Heisenberg uncertainty principle. In the social sciences, it's even more pronounced.

When people ask me what alternative to VAR I have to offer, my answer is: smaller leverage, less naive diversification, less reliance on dynamic hedging.

**DS:** Are all correlations suspect?

**NT:** You can find a relationship between any two items if you look hard enough. It will be entirely spurious and have no predictive power, but you will find one. To give you an idea, you'll always find what we call data miners who will show you that there is a 100 percent correlation between his great aunt's blood pressure and the back month Nikkei volatility. When you're a trader, you get a lot of calls from folks who found relationships that can produce a 10 Sharpe ratio. That means it's almost impossible to lose money on the trade. Sure enough, when you start trading, you realize that the relationship was not there. Trading has fewer biases than statistics.

**DS:** What are the most common mistakes you see traders and risk managers making?

**NT:** As a trader, my job is to understand biases and trade on them. There are all kinds of biases. The most common is the small sample bias. Let's say you have 1 to 1000 odds you will come home every day with a dollar and once in a while you lose $1000. Many traders show very steady incomes but they could be fooling themselves because they don't have a long enough period of time to chart their performance. Their Sharpe ratio will not be indicative. In option trading, there is a similar bias. Short premium option traders, typically those who sell out-of-the-money options, are more likely to make money on a daily basis and then blow up. Likewise, the yield hogs, those traders who would take any risk for a few basis points. You can fool yourself with your Sharpe ratios, and you can fool all of the financial engineers, but you can't fool an old Chicago trader who went bankrupt twice.

Another bias is what I call the size bias. If you have twenty thousand traders in the market, sure enough, you'll have someone who's been up every day for the past few years and will show you a beautiful P&L. If you put enough monkeys on typewriters, one of the monkeys will write the Iliad in ancient Greek. But would you bet any money that he's going to write the Odyssey next? You know that because of the sheer size of the sample, you're likely to find a lucky monkey once in a while. But the same applies to traders.

A third bias is the survival bias. Everybody will tell you that stock investing is a great idea because it's been back-tested by some serious

 Guru and if you bought one share of some stock during the revolution you would have owned the GNP of some banana republic. But you forget that your back-testing is only on stocks that are alive today and did not cover stocks in imperial Russia that a rational investor would have bought at the beginning of the century. Many continental stocks were recycled into wallpaper. When you look at markets, you are only looking at the remnants, the parts that have survived. Or take real estate. People always say it goes up. But that works only if you always bought in places that became fancy.

**DS:** So essentially, you'd like to replace statistical valuation that's at the center of most derivatives trading with valuation that's more based on experience.

**NT:** You learn a lot about valuation from trading with other traders, by seeing what others give you and what they take away from you. What they give is generally worth less, and what they take is worth more. It's sort of like cars that are lemons. When you buy a lemon, only the seller knows it's a lemon. You need to drive it for a while to know it's a lemon. It's the same with options. You don't know an option is a lemon, but you have to assume if someone is selling it to you, you have a high probability of it being a lemon. Very often you won't know the option's value until you actually manage it for a while. Some options hedge very well and some don't.

**DS:** Can you give me an example?

**DT:** Sure, take upside calls on the S&P. Retail investors tend to sell a lot of higher strike calls in equity markets and buy a lot of lower strike puts. You look at the distributions and you assume you're being compensated with the volatility differential buying higher strike calls and selling lower strike puts. But once you start running it, you will notice that some undetectable behavior makes you lose money on the trade. And your back-testing cannot fully detect that.

It's more intricate than it seems. It's not just the volatility of the upside or the downside, it's the volatility around a particular strike that has a large open interest. We call these sticky strikes. The markets tend to compress in variation around these strikes. Good traders can sense that.

Also, when you have a stock warrant on an illiquid stock, you need to take into account that your own hedging will reduce the volatility and stabilize the stock. That added to that of other dynamic hedgers.

**DS:** You left a job as the senior options trader at the Union Bank of Switzerland to go to Chicago and become a floor trader. Why did you leave Wall Street? What did you think you were missing by trading from a screen in New York?

**NT:** I left Wall St. for the first time in 1991. I was obsessed with price formation. I couldn't understand from the screen how prices were determined. It took me six months to be able to read prices in the pit. Locals basically read information from the order flow and squeeze the weak party. There's always a pack of five or six dominating locals who abruptly change the prices, who bid a lot higher than the previous offer and have the guts to do it and the rest of them follow.

**DS:** How did that knowledge change the way you trade when you went back to trading from a screen?

**NT:** It is the most enriching experience for a trader. I learned more about market dynamics in my second six months than from years on a desk. I learned that traders' income is not the bid-offer spread, but the micro-squeezes that take place. Markets move from squeezes to squeezes. Traders make money on stop losses and other free options. It made me interested in information economics.

**DS:** You're not ready to give up on all quantitative techniques. You were trained as a statistician. You don't make wild speculative bets and I assume you try to hire traders who have some kind of quantitative skills.

**NT:** I have the following problem. Anytime I take a street-smart kid with a strong Brooklyn accent and train him or her in quant methods, I develop a wonderful quant trader who knows how to squeeze the sitting ducks. When you take extremely quantitative trainees, particularly from the physical sciences, and try to make them arbitrage traders, they freak out and become pure gamblers. They can’t see the edge and become the sitting ducks. The world has too much texture than they can squeeze into the framework they're used to. I see a huge incidence of pure speculative gambling on the part of these folks who are hired on the strength of their knowledge of quantitative methods.

**DS:** How about risk managers? What do you look for in risk managers that you hire?

**NT:** I try to probe their minds to see what makes them tick. And I start quizzing them quite unfairly about market history. I ask them about what happened to the correlation between bonds and mortgages on the day when the stock market crashed. I quiz them about the gold rally in the early '80s. I test to see if they intuitively understand squeezes. If they don't show any interest in data, in any true market history, I stop the interview and send them home. To me, it is extremely dangerous to have in such positions people who only trust equations. You can’t get the edge if you just learn from your own mistakes. You need to learn from other people’s mistakes as well and these are public information.

**DS:** Where do you think research in the financial markets is heading? What's valuable and what's not?

**NT:** Financial economics has been extremely successful at melding the math with economic insight. This is providing traders with a better understanding of derivatives pricing. My motto is that the markets follow the path that hurts the highest number of dynamic hedgers. It was exciting to read a mathematical proof of it by Grossman and Zhou in the latest Journal of Finance. We are having less success with the frenetic financial engineering efforts, with a lot of mathematical acrobatics, but a hollow ring.

[Source](https://merage.uci.edu/~jorion/oc/ntaleb.htm)

## 
It's indeed fascinating that Taleb's criticisms were written just before these pivotal events. His insights about the limitations and dangers of financial engineering were eerily prescient.

1. **Black-Scholes Nobel Prize (1997):**
   - The awarding of the Nobel Prize to Black-Scholes for their options pricing model celebrated the triumph of financial engineering. However, Taleb's critique highlights a significant flaw: the reliance on models that assume stable, predictable markets. Taleb argued that these models fail to account for extreme events and the real-world complexities of financial markets. The Nobel Prize validated an approach that Taleb considered fundamentally flawed in managing real-world risk.

2. **Russian Default and LTCM Collapse (1998):**
   - Russia's bond default shattered the assumption that sovereign bonds were risk-free, an assumption critical to many financial models, including those used by LTCM. Taleb's warnings about the false precision of VAR and other models came true as LTCM's sophisticated strategies, which relied heavily on mathematical models, failed spectacularly. The fund's collapse was a dramatic example of the dangers of overfitting and the inability of models to predict rare but impactful events.

Taleb's main arguments were proven correct by these events:
- **Overreliance on Models:** He warned that financial models give a false sense of security. LTCM's collapse showed that models couldn't foresee or handle the chaos of real market conditions.
- **Underestimation of Rare Events:** Taleb emphasized the significance of rare, high-impact events. The Russian default was a perfect example of an unpredictable event that models failed to account for, leading to massive losses.
- **Misleading Precision:** He criticized VAR for providing misleading precision. The events of 1998 demonstrated how reliance on such models could lead to complacency and inadequate risk management.

Taleb's critique serves as a sobering reminder that while financial engineering can provide useful tools, it must be tempered with a deep understanding of market realities and the inherent unpredictability of financial systems. The Black-Scholes Nobel Prize and the LTCM debacle illustrate the gulf between theoretical models and real-world outcomes, vindicating Taleb's skepticism about the efficacy of financial engineering in managing risk.