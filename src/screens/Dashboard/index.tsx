import React, { useCallback, useEffect, useState }from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

import { useFocusEffect} from '@react-navigation/native';

import { HighlightCard } from '../../components/HighlightCard';
import { TransactionCard, TransactionCardProps } from '../../components/TransactionCard';




import {    
    Container,
    Header,
    UserWrapper,
    UserInfo,
    Photo,
    User,
    UserGreeting,
    UserName,
    Icon,
    HighlightCards,
    Transactions,
    Title,
    TransactionsList,
    LogoutButton
} from './styles';

 export interface DataListProps extends TransactionCardProps{
    id: string;
}

interface HighlightProps{
    amount: string;
}

interface HighlightData {
   entries: HighlightProps;
   expensives: HighlightProps;
   total:HighlightProps;
}

export function Dashboard(){
    const [transactions, setTransactions] = useState<DataListProps[]>([]);
    const [HighlightData, setHighlightData] = useState<HighlightData>({} as HighlightData);

    async function loadTransactions(){
        const dataKey = '@gofinances:transactions';
        const response = await AsyncStorage.getItem(dataKey);
        const transactions  = response ? JSON.parse(response) : [];

        let entriesTotal = 0;
        let expensiveTotal = 0;

        const transactionsFormatted: DataListProps[] = transactions
        .map((item: DataListProps) => {

            if(item.type === 'positive'){
                entriesTotal += Number(item.amount);
            }else {
                expensiveTotal += Number(item.amount);
            }

            const amount = Number(item.amount).toLocaleString('pt-BR',{
                style: 'currency',
                currency: 'BRL'
            });

            const formattedDate = item.date ? new Date(item.date): undefined;

            const date = new Intl.DateTimeFormat('pt-BR', {
                day: '2-digit',
                month: '2-digit',
                year:('2-digit')
            }).format(formattedDate);
            console.log('date',date)

            return{
                id: item.id,
                name: item.name,
                amount,
                type: item.type,
                category: item.category,
                date,
               
            }
        });

        console.log('transctionsFormatted',transactionsFormatted);

        const total = entriesTotal - expensiveTotal;

        setHighlightData({
            entries:{
                amount: entriesTotal.toLocaleString('pt-BR',{
                    style: 'currency',
                    currency: 'BRL'
                })
            },
            expensives:{
                amount: expensiveTotal.toLocaleString('pt-BR', {
                    style: 'currency',
                    currency: 'BRL'
                })
            },
            total: {
                amount: total.toLocaleString('pt-BR', {
                    style: 'currency',
                    currency: 'BRL'
            })
          }
        });
        setTransactions(transactionsFormatted.sort().reverse());
       



    }

    useEffect(() => { 
        loadTransactions();     
    },[]);

    useFocusEffect(useCallback(() => {
        loadTransactions();
    },[]));

    return(
        <Container>
            <Header>
              <UserWrapper>
                <UserInfo>
                    <Photo source={{ uri: 'https://avatars.githubusercontent.com/u/64935240?v=4'}}/>
                    <User>
                        <UserGreeting>Olá,</UserGreeting>
                        <UserName>Eduardo</UserName>
                    </User>
                </UserInfo>

                <LogoutButton onPress={() => {}}>
                <Icon name="power"/>
                </LogoutButton>
                </UserWrapper>
            </Header>
            
            <HighlightCards>
            <HighlightCard 
            type="up"
            title="Entradas" 
            amount={HighlightData?.entries?.amount}
            lastTransaction="Última entrada dia 13 de Abril "/>

            <HighlightCard 
            type= "down"
            title="Saídas" 
            amount={HighlightData?.expensives?.amount}
            lastTransaction="Última saída dia 03 de Abril "/>

            <HighlightCard 
            type= "total"
            title="Total" 
            amount={HighlightData?.total.amount}
            lastTransaction="01 á 16 de Abril "/>
        
            </HighlightCards>

            <Transactions>
                <Title>Listagem</Title>

                <TransactionsList
                data={transactions}
                keyExtractor={item => item.id}
                renderItem={({ item }) => <TransactionCard data={item} />}
                
                />
            </Transactions>
        </Container>
    )
}
