# Terms of Use

**Effective date:** 6 October 2026 · **Version:** 1.0

These terms are the agreement between Zoorik and the organisation that uses our products. Read them with our Privacy Policy (zoorik.com/privacy), which explains how we handle personal data.

## The short version

- These terms cover zoorik.com, Coral, Amoeba, zoorikctl, our agents and the free assessment scripts.
- Our products are for businesses. You accept these terms for your organisation.
- Coral and Amoeba make real changes in your clusters and cloud accounts. Some Coral settings are on as soon as a cluster connects. Check these settings, and keep your own backups.
- Amoeba deletes your original disks 48 hours after it moves their data, and their snapshots 7 days after that.
- Your data stays yours. We use it only to run our products for you.
- Savings figures are estimates. We promise no level of savings or uptime unless a signed agreement does.
- You can stop at any time. Indian law applies, and the courts in Bengaluru decide disputes.

## 1. Who we are

"Zoorik", "we" and "us" mean Zoorik Private Limited, a company incorporated in India, CIN U62011KA2026PTC228102, with its registered office at Vaishnavi Signature, No. 78/9, Outer Ring Road, Bellandur, Bangalore South, Bangalore 560103, Karnataka.

"You" means the organisation that uses our products. The people who use them for it must follow these terms too.

## 2. What these terms cover

- **zoorik.com** and our other websites.
- **Coral**, which rebalances Kubernetes clusters on Azure and AWS: its console, its agent and its node daemon.
- **Amoeba**, which rightsizes block storage on Azure: its console, its agent and its set-up script.
- **zoorikctl**, our command-line tool.
- **The free assessment scripts** at zoorik.com/assess/k8s and zoorik.com/assess/disks.

Together we call these "our products".

## 3. Accepting these terms

- You accept these terms for your organisation when you accept them in Coral or Amoeba, or when you first sign in to Coral, connect a cluster or connect Amoeba, whichever comes first. By doing so you confirm that you are allowed to accept them for your organisation. If you are not, do not use our products.
- Our products are for businesses, not for personal use. You must be at least 18 to use them.
- If your organisation has signed a separate agreement with us, that agreement wins where it differs from these terms. If you buy through a cloud marketplace, the contract you accept there governs that purchase and wins where it differs from these terms.

## 4. Your organisation's account

- You sign in to Coral with Microsoft or Google. The first person to connect a cluster becomes the Owner of the organisation. Anyone who later connects a cluster from an Azure subscription or AWS account your organisation already holds joins it as a Viewer, who can see everything but change nothing. To change someone's role or remove them, email founders@zoorik.com.
- Amoeba has one organisation for each Azure directory you connect.
- Your organisation is responsible for everything done in its account. Keep your Coral sign-in secure, and tell us at once if you think someone has misused your account.

## 5. What our products change, and your instructions

Coral and Amoeba act in your clusters and cloud accounts. The settings you turn on or leave on, and the choices you make in our products, are your instructions to us. We act on them, and we use the access you give us only to carry them out and to run our products for you.

**Coral.** Depending on its settings, Coral:
- changes the CPU, memory and number of replicas of your workloads, and creates or takes over their HorizontalPodAutoscalers, which can restart or replace their pods;
- moves pods between nodes;
- drains and removes nodes, and changes node pools;
- if your cluster has no node provisioner or cluster autoscaler when you connect it, turns on your cloud's own (Node Auto Provisioning on AKS, Karpenter on EKS), after you confirm.

**What is on when a cluster connects.** Workload optimization, Node optimization and the Evictor are all on, unless you switch Workload optimization or Node optimization off in the Connect dialog. You can switch the Evictor off only in Settings. With Node optimization on, Coral drains and removes the nodes it finds surplus without asking first. Switching Node optimization off does not stop the Evictor, which empties nodes in any pool your cluster autoscaler or Karpenter manages. No workload's CPU, memory or replicas change until you turn on Automatically optimize, which is off at first. Rebalancing runs only when someone in your organisation starts it or saves a schedule.

**Rebalancing and PodDisruptionBudgets.** A rebalancing run moves pods only in ways that respect your PodDisruptionBudgets. If pods are still on a node 45 minutes later, Coral leaves that node in place and goes on with the rest of the run.

**Amoeba.** Choosing a VM in Amoeba is your instruction to us to:
- install the Amoeba agent on it;
- copy its data disks onto a pool of new disks, inside the VM, then switch each disk over, which briefly stops and restarts the services that use it;
- 48 hours later, once each original disk's snapshot has succeeded, delete the original disks;
- delete those snapshots 7 days after that;
- grow and shrink the pool, deleting pool disks it no longer needs.

Until the original disks are deleted, you can reverse the move in Amoeba; check your data on the new disks in that time. Once a snapshot is deleted, the data on that original disk cannot be recovered.

**Your part.**
- Check each setting before you rely on it, and try our products on systems you can afford to disturb first.
- Keep your own backups of any data you cannot afford to lose.
- Do not use our products on systems where an automatic change could put anyone's life or safety at risk.

**Your cloud bill.** Your cloud provider bills you for your resources, including the nodes your cluster's provisioner adds and the disks and snapshots Amoeba creates or keeps. The savings our products show are estimates.

## 6. Using our products properly

You must not:
- use our products on clusters, subscriptions or accounts you are not allowed to manage;
- use them to break the law or your cloud provider's terms;
- try to reach another organisation's data, or test our security without our written permission (we welcome security reports at founders@zoorik.com);
- copy, change or reverse engineer our software, except where the law allows it;
- overload or disrupt our products, resell them, or use them to build a competing product.

## 7. Your data

- Your data stays yours. You let us process it only to provide, secure and support our products for you, as our Privacy Policy describes.
- You are responsible for having the right to give us your data, including any personal data in your cluster or VM data.
- If you send us feedback or ideas, we may use them freely, with no duty to you.

## 8. When we process personal data for you

When your cluster or VM data contains personal data, we process it for you (Privacy Policy, section 3). For that data, we:
- act only on your instructions: these terms, your settings and choices in our products, and what you ask us in writing;
- make sure everyone at Zoorik who can access it keeps it confidential;
- protect it as section 10 of the Privacy Policy describes;
- use only the sub-processors listed in section 7 of the Privacy Policy, bind each one to protect the data as these terms do, and stay responsible for them; tell you before we add or replace one, so that you can object, and if we cannot resolve your objection you may stop using the product concerned;
- help you answer requests from people about their data, and meet your own legal duties;
- tell you without undue delay after we learn of a breach that affects it;
- delete it when you stop using our products, as section 9 of the Privacy Policy describes, unless the law requires us to keep it;
- answer your reasonable written security questions, once a year, so you can show you meet your duties.

If the GDPR or the UK GDPR applies to that data, we will sign a data processing agreement with you that includes the European Commission's standard contractual clauses (and, for UK data, the UK addendum); email founders@zoorik.com.

## 9. Our software

- We own our products. While you use them, we give your organisation a limited, non-exclusive, non-transferable right to use them, and to install zoorikctl and our agents, for its own business.
- You may run the free assessment scripts to assess your own environments.
- Open-source parts of our products come under their own licences.
- Zoorik, Coral and Amoeba, and their logos, are our trademarks.

## 10. Fees

- zoorik.com and the free assessment scripts are free.
- If you pay for a product, the price, billing period and payment terms are in your order or your marketplace purchase. Prices do not include taxes, such as GST, unless they say so.

## 11. Availability and changes

- We work to keep our products available, but we promise no level of uptime unless a signed agreement does.
- We may change or remove features. If a change takes away something you rely on, we will tell you in advance where we can.

## 12. Stopping, suspension and ending

**You can stop at any time.**
- **Coral:** `zoorikctl cluster disconnect` removes Coral from your cluster and offers to remove the cloud identity it created. Running pods keep their current resources, and a node provisioner that connecting turned on stays in your cluster.
- **Amoeba:** wait until no VM shows "Creating pool" in the Amoeba console. Within a VM's first 48 hours on its pool, you can instead go back to its original disks with "Reverse cutover". Then remove the Zoorik Storage Operator role assignment, or remove Zoorik's app from your directory, and run `systemctl disable --now amoeba-agent` on each VM. Your data stays on the `zoorik-amoeba-pool-…` disks, and nothing grows them once Amoeba stops, so keep them and watch their free space. Snapshots Amoeba has not deleted yet stay in your subscription until you delete them.
- Stopping does not delete the data we hold straight away. We delete it within 30 days after you stop, or after you ask us at founders@zoorik.com, as section 9 of the Privacy Policy describes.

**We may suspend or end your access** if you break these terms, do not pay, or your use puts others or our products at risk. We will tell you first, unless the risk is urgent or the law stops us.

Sections 7, 8, 9, 12 to 16, 18 and 19, and any fees you already owe, still apply after access ends.

## 13. What we do not promise

- To the extent the law allows, we provide our products "as is" and "as available", without any promise that they are fit for a particular purpose or free of errors.
- Recommendations and savings figures are estimates. A change to a workload or a node can affect how your systems run. You decide which changes to allow.
- We are not responsible for your cloud provider's services, prices or outages.

## 14. Limits on liability

- Neither of us is liable to the other for indirect or consequential losses, or for lost profits, revenue or business. This does not limit fees you owe us or your duties under section 15.
- We are not liable for the loss of data that you could have restored from a backup kept as section 5 asks.
- Our total liability to you for all claims is limited to the greater of what you paid us in the 12 months before the claim arose and ₹10,000.
- These limits do not apply to fraud, wilful misconduct, or any liability the law does not allow us to limit.

## 15. Claims against us

If someone else makes a claim against us because of your data or your instructions to us, or because you used our products against these terms or the law, you will defend us and pay the losses and reasonable costs that result. This does not cover a claim caused by our own breach of these terms. We will tell you about the claim promptly and let you control its defence.

## 16. Confidentiality

Each of us keeps the other's non-public information confidential and uses it only for these terms. This does not cover information that is public, that the receiver already had or built on its own, or that the law requires it to disclose; in that last case, the receiver tells the other first where the law allows.

## 17. Changes to these terms

When we change these terms, we post the new version here and update the date at the top. Before an important change takes effect, we will email Coral users at least 30 days ahead. Amoeba keeps no contact details, so for Amoeba we will show a notice in the Amoeba console at least 30 days ahead. A change the law requires may take effect sooner. If you keep using our products after a change takes effect, the new terms apply. If you do not agree, stop using them.

## 18. Law and disputes

- Indian law governs these terms.
- If a dispute arises, email us first, and we will both try to settle it within 30 days.
- If we cannot, the courts in Bengaluru, Karnataka, decide it, and only they.

## 19. General

- These terms, the Privacy Policy and any order or agreement you sign with us are the whole agreement between us about our products.
- You may not transfer these terms without our written consent. We may transfer them as part of a merger, acquisition or sale of our business.
- Neither of us is responsible for delays caused by events outside its reasonable control.
- If a court finds part of these terms unenforceable, the rest still applies. Not enforcing a term is not a waiver of it.
- We send notices to the email address of your Coral organisation's Owner. Amoeba keeps no contact details, so for Amoeba we show notices in the Amoeba console. Send notices to us at founders@zoorik.com.
- You must follow the export control and sanctions laws that apply to you.
- These terms are written in English, and the English version applies.

## 20. Contact us

**Email:** founders@zoorik.com · **Post:** our registered office (section 1). For privacy questions and grievances, see section 15 of the Privacy Policy.
