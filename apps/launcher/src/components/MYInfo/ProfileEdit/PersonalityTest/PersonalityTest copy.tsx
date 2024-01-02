import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { ProgressBar, IconButton,Appbar  } from 'react-native-paper';
import { useNavigation } from '@react-navigation/native';

const OptionCircle = ({ size, isSelected, onPress }) => {
    return (
        <TouchableOpacity onPress={onPress} style={{ ...styles.circle, width: size, height: size, borderRadius: size / 2, borderColor: '#1DA1F2', backgroundColor: isSelected ? '#1DA1F2' : 'transparent' }} />
    );
};

const QuestionCard = ({ question, onOptionSelect }) => {
    const [selectedOption, setSelectedOption] = useState(null);

    return (
        <View style={styles.questionCard}>
            <Text style={styles.questionText}>{question.text}</Text>
            <View style={styles.optionsRow}>
                {[50, 40, 30, 40, 50].map((size, index) => (
                    <OptionCircle key={index} size={size} isSelected={selectedOption === index} onPress={() => { setSelectedOption(index); onOptionSelect(question.id, index); }} />
                ))}
            </View>
        </View>
    );
};

const PersonalityTest = ({ route }) => {
    const { questions, username } = route.params;
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
    const [answers, setAnswers] = useState([]);
    const [allSelected, setAllSelected] = useState(false);
    const navigation = useNavigation();

    const handleOptionSelect = (questionId, optionIndex) => {
        const newAnswer = { username, questionId, option: optionIndex };
        setAnswers(prev => {
            const updatedAnswers = [...prev, newAnswer];
            setAllSelected(updatedAnswers.length === (currentQuestionIndex + 3));
            return updatedAnswers;
        });
    };

    const handleNextPage = () => {
        if (!allSelected) {
            alert('请先完成所有问题！');
            return;
        }

        if (currentQuestionIndex + 3 >= questions.length) {
            const dataToSend = answers.map(answer => ({
                username: username,
                questionId: answer.id,
                type: answer.type,
                answer: answer.answer
            }));

            fetch('YOUR_BACKEND_URL', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(dataToSend),
            })
            .then(response => response.json())
            .then(data => {
                console.log('Data sent successfully!', data);
            })
            .catch((error) => {
                console.error('There was an error sending the data!', error);
            });
        } else {
            setCurrentQuestionIndex(prev => prev + 3);
        }
    };

    return (
    
        <View style={styles.container}>
             <Appbar.Header>
                <Appbar.BackAction onPress={() => navigation.goBack()} />
                <Appbar.Content title="性格测试" />
            </Appbar.Header>
            <ProgressBar progress={(currentQuestionIndex + 1) / questions.length} color="#1DA1F2" />
            {questions.slice(currentQuestionIndex, currentQuestionIndex + 3).map((question, index) => (
                <QuestionCard key={index} question={question} onOptionSelect={handleOptionSelect} />
            ))}
            <TouchableOpacity 
                style={[styles.nextButton, !allSelected ? styles.disabledButton : {}]} 
                onPress={handleNextPage} 
                disabled={!allSelected}
            >
                <Text style={styles.nextButtonText}>下一页</Text>
            </TouchableOpacity>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#FAFAFA',
        paddingHorizontal: 15,
    },
    circle: {
        borderWidth: 1,
        marginHorizontal: 5,
        alignItems: 'center',
        justifyContent: 'center',
    },
    questionCard: {
        flex: 0.3,
        justifyContent: 'center',
    },
    questionText: {
        fontSize: 16,
        color: '#333',
        marginBottom: 15,
    },
    optionsRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 10,
    },
    nextButton: {
        alignSelf: 'center',
        backgroundColor: '#1DA1F2',
        paddingHorizontal: 20,
        paddingVertical: 10,
        borderRadius: 5,
        marginTop: 15,
    },
    disabledButton: {
        backgroundColor: 'gray',
        opacity: 0.5,
    },
    nextButtonText: {
        color: 'white',
    }
});

export default PersonalityTest;
