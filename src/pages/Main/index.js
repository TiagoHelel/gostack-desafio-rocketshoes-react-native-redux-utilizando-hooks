import React, {useState, useEffect} from 'react'
import {useSelector, useDispatch} from 'react-redux'
import {FlatList} from 'react-native'

import Icon from 'react-native-vector-icons/MaterialIcons'
import * as CartActions from '../../store/modules/cart/actions'

import api from '../../services/api'
import {formatPrice} from '../../util/format'

import {
    Container,
    Product,
    ProductImage,
    ProductTitle,
    ProductPrice,
    AddButtom,
    ProductAmount,
    ProductAmountText,
    AddButtomText,
} from './styles'

export default function Main() {
    const [products, setProducts] = useState([])
    const amount = useSelector(state =>
        state.cart.reduce((sumAmount, product) => {
            sumAmount[product.id] = product.amount
            return sumAmount
        }, {})
    )
    const dispatch = useDispatch()
    useEffect(() => {
        async function loadProducts() {
            const response = await api.get('/products')
            const data = response.data.map(product => ({
                ...product,
                priceFormatted: formatPrice(product.price),
            }))
            setProducts(data)
        }
        loadProducts()
    }, [])
    function handleAddProduct(id) {
        dispatch(CartActions.addToCartRequest(id))
    }
    function renderProduct({item}) {
        return (
            <Product key={item.id}>
                <ProductImage
                    source={{
                        uri: item.image,
                    }}
                />
                <ProductTitle>{item.title}</ProductTitle>
                <ProductPrice>{item.priceFormatted}</ProductPrice>
                <AddButtom onPress={() => handleAddProduct(item.id)}>
                    <ProductAmount>
                        <Icon name="add-shopping-cart" color="#fff" size={20} />
                        <ProductAmountText>
                            {amount[item.id] || 0}
                        </ProductAmountText>
                    </ProductAmount>
                    <AddButtomText>ADICIONAR</AddButtomText>
                </AddButtom>
            </Product>
        )
    }
    return (
        <Container>
            <FlatList
                vertical
                data={products}
                keyExtractor={item => String(item.id)}
                renderItem={renderProduct}
            />
        </Container>
    )
}
