import React from "react";
import { categories } from "../../Utils/categories";
//import { Amount, Footer, Title } from "../HighlightCard/styles";

import {
    Container,
    Title,
    Amount,
    Footer,
    Category,
    Icon,
    CategoryName,
    Date,
} from './styles';

 export interface TransactionCardProps {
    type: 'positive' | 'negative'
    name: string;
    amount: string;
    category: string;
    date: string;
}
interface Category{
    name: string;
    icon: string;
}

interface Props{
data: TransactionCardProps;
}

export function TransactionCard({ data } : Props){
    const [ category ] = categories.filter(
        item => item.key === data.category
    );
    return(
        <Container>
            <Title>{data.name}</Title>

            <Amount type={data.type}>
                {data.type === 'negative' && '- '}
                {data.amount}
                </Amount>

            <Footer>
                <Category>
                    <Icon name={category.icon} />
                    <CategoryName>{category.name}</CategoryName>
                </Category>
                <Date>{data.date}</Date>
            </Footer>
        </Container>
    )
}


